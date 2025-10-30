import {
  createUser,
  getUserCredentials,
  getPasswordResetCredentials,
  clearUserSession,
  editUser
} from "../outbound/userRepository";
import { createUserSessionCookie } from '../outbound/userSessionCookie';
import { requireEnvVar } from "@logger/envcheck";
import { logger } from '@logger';
import { ErrorKeys } from "@errors/errors.types";
import { hashEmail, hashPassword, compareHash, createRandom } from "@services/encryption/hash";
import { encrypt, decrypt } from '@services/encryption'
import { UserCredentials } from '../types';
import jwt from "jsonwebtoken";
import { sendSingleEmail } from "@services/emailer";
import { ValidationError } from '@errors'

const SECRET_KEY_JWT = requireEnvVar("SECRET_KEY_JWT");

export const resetPassword = async (
  newPassword: string,
  resetToken: string,
  email: string,
) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  if (!emailRegex.test(email)) {
    throw new ValidationError(
      "Invalid email format for password reset",
      "emailRegex.test",
      [email],
      ErrorKeys.EMAIL_INVALID
    );
  }

  const hashedEmail = hashEmail(email);
  
  const userCredentials = await getPasswordResetCredentials(hashedEmail);
  
  const { id, password_reset_token, password_reset_expiry } = userCredentials;
  
  if (!id || !password_reset_token || !password_reset_expiry) {
    throw new ValidationError(
      "No active password reset request found",
      "getPasswordResetCredentials",
      [hashedEmail],
      ErrorKeys.TOKEN_INVALID
    );
  }

  if (password_reset_token !== resetToken) {
    throw new ValidationError(
      "Reset token does not match",
      "password_reset_token comparison",
      [],
      ErrorKeys.TOKEN_INVALID
    );
  }

  const expirationDate = new Date(password_reset_expiry);
  const currentDate = new Date();
  
  if (currentDate >= expirationDate) {
    logger.log(ErrorKeys.RESET_TOKEN_EXPIRED);
    
    await editUser(id, {
      password_reset_token: null,
      password_reset_expiry: null,
    });
    
    throw new ValidationError(
      "Reset token has expired",
      "password_reset_expiry check",
      [password_reset_expiry],
      ErrorKeys.RESET_TOKEN_EXPIRED
    );
  }

  const hashedPassword = await hashPassword(newPassword);
  
  await editUser(id, {
    password_reset_token: null,
    password_reset_expiry: null,
    password: hashedPassword,
  });

  return {
    success: true,
  };
};


export const offerPasswordReset = async (requestEmail: string) => {
  const sanitizedEmail = requestEmail.replace(/[^a-zA-Z0-9@._-]/gi, "");
  const hashedEmail = hashEmail(sanitizedEmail);
  
  try {
    const userCredentials: UserCredentials | null = await getUserCredentials(hashedEmail);

    // Don't conditionally execute these lines that create tokens 
    // because if someone's enumerating they might time attempts
    // and it should take the same time even if they're wrong
    const resetToken = await createRandom();
    const aDayInMilliseconds = 24 * 60 * 60 * 1000;
    const expirationDate = new Date(Date.now() + aDayInMilliseconds);

    if (!userCredentials) {
      logger.log(ErrorKeys.CREDENTIALS_MISSING);
      // Same deal here this is to pretend to send an email timing wise.
      await new Promise(resolve => setTimeout(resolve, 50));
      return {
        success: true,
      };
    }

    const { id, email } = userCredentials;

    if (!id || !email) {
      logger.log(ErrorKeys.EMAIL_INVALID);
      await new Promise(resolve => setTimeout(resolve, 50));
      return {
        success: true,
      };
    }

    const update = {
      password_reset_token: resetToken,
      password_reset_expiry: expirationDate,
    };

    await editUser(id, update);
    const decryptedEmail = decrypt(email);
    
    await sendSingleEmail(
      decryptedEmail,
      "Password Reset",
      `
      <p>Hello!</p>
      <p>You are receiving this email because of an attempt to reset your password.</p>
      <p>
        <a href="${requireEnvVar("SERVER_URL")}/auth/password/${resetToken}">
          Click here to reset your password.
        </a>
        This link will expire in 24 hours.
      </p>
      <p>
        If you did not request this password reset, please ignore this email or contact us at ${requireEnvVar(
          "SUPPORT_EMAIL_ADDRESS",
        )} to report this incident.
      </p>
      `,
    );

    return {
      success: true,
    };
  } catch (error: any) {
    logger.error(error.message, error);
    return {
      success: false,
      error: ErrorKeys.GENERAL_SERVER_ERROR,
    };
  }
};


export const logoutUser = async (token: string) => {
  let decoded;
  try {
    decoded = jwt.verify(token, SECRET_KEY_JWT) as { sub: string };
  } catch (error: any) {
    throw new ValidationError(
      "Invalid token during logout",
      "jwt.verify",
      [token],
      ErrorKeys.TOKEN_INVALID
    );
  }
  
  const userId = decoded.sub;
  const sessionCleared = await clearUserSession(userId, token);
  
  if (!sessionCleared) {
    throw new ValidationError(
      "Session not found for user",
      "clearUserSession",
      [userId, token],
      ErrorKeys.SESSION_MISSING
    );
  }
  
  return {
    success: true,
    user: userId,
  };
};


export const loginUser = async (credentials: UserCredentials) => {
  const { email, password } = credentials;
  if (!email || !password) {
    logger.log(ErrorKeys.CREDENTIALS_INVALID);
    return {
      success: false,
      error: ErrorKeys.CREDENTIALS_INVALID
    };
  }

  const sanitizedEmail = email.replace(/[^a-zA-Z0-9@._-]/gi, "");
  const hashedEmail = hashEmail(sanitizedEmail);

  const userCredentials = await getUserCredentials(hashedEmail);

  if (!userCredentials || !userCredentials.id) {
    logger.log(ErrorKeys.CREDENTIALS_INVALID);
    return { 
      success: false,
      error: ErrorKeys.CREDENTIALS_INVALID
    };
  }

  const storedPassword = userCredentials.password;
  if (!storedPassword) {
    logger.log(ErrorKeys.CREDENTIALS_INVALID);
    return { 
      success: false,
      error: ErrorKeys.CREDENTIALS_INVALID
    };
  }

  const isMatch = await compareHash(password, storedPassword);
  if (!isMatch) {
    logger.log(ErrorKeys.CREDENTIALS_INVALID);
    return { 
      success: false,
      error: ErrorKeys.CREDENTIALS_INVALID
    };
  }

  const idString = userCredentials.id.toString();
  const sessionCookie = await createUserSessionCookie(idString);

  return {
    success: true,
    userId: userCredentials.id,
    username: userCredentials.username,
    sessionCookie,
  };
};

export const registerUser = async (
  password: string,
  name: string,
  email: string,
) => {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: ErrorKeys.CREDENTIALS_INVALID
    };
  }

  const validUsername = /^[a-zA-Z0-9_-]+$/;
  if (!validUsername.test(name)) {
    return {
      success: false,
      error: ErrorKeys.CREDENTIALS_INVALID
    };
  }
  const encryptedEmail = encrypt(email);
  const hashedEmail = await hashEmail(email);
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser(
      name,
      encryptedEmail,
      hashedEmail,
      hashedPassword,
    );

    if (newUser) {
      return {
        success: true,
        data: newUser,
      };
    }
  } catch (error: any) {
    let errorKey = ErrorKeys.GENERAL_SERVER_ERROR;
    if (error.message.includes("email")) {
      errorKey = ErrorKeys.EMAIL_TAKEN;
    }
    if (error.message.includes("username")) {
      errorKey = ErrorKeys.USERNAME_TAKEN;
    }
    return {
      success: false,
      error: errorKey,
    };
  }
  return {
    success: false,
    error: ErrorKeys.GENERAL_SERVER_ERROR,
  };
};