import {
  createUser,
  getUserCredentials
} from "../outbound/userRepository";
import { createUserSessionCookie } from './outbound/userSessionCookie';
import { requireEnvVar } from "@logger/envcheck";
import { ErrorKeys } from "@errors/errors.types";
import { hashEmail, hashPassword, compareHash } from "@services/encryption/hash";
import { encrypt } from '@services/encryption'

const SECRET_KEY_JWT = requireEnvVar("SECRET_KEY_JWT");

type UserCredentials = {
  password: string;
  email: string; 
}

export const loginUser = async (credentials: UserCredentials) => {
  const { email, password } = credentials;
  if (!email || !password) {
    const invalidLogin = new Error(ErrorKeys.CREDENTIALS_INVALID);
    throw invalidLogin
  }

  const sanitizedEmail = email.replace(/[^a-zA-Z0-9@._-]/gi, "");
  const hashedEmail = hashEmail(sanitizedEmail);

  try {
    const userCredentials = await getUserCredentials(
      "hashed_email",
      hashedEmail,
    );

    if (!userCredentials || !userCredentials.id) {
      logger.log("loginUser - invalid user credentials");
      return { success: false };
    }

    const storedPassword = userCredentials.password;
    if (storedPassword) {
      const isMatch = await compareHash(password, storedPassword);
      if (isMatch) {
        const idString = userCredentials.id.toString();
        const sessionCookie = await createUserSessionCookie(idString);
        return {
          success: true,
          userId: userCredentials.id,
          username: userCredentials.username,
          sessionCookie,
        };
      }
    }
  } catch (error: any) {
    logger.error(error);
    return {
      success: false,
      error: ErrorKeys.GENERAL_SERVER_ERROR,
    };
  }
  return { success: false };
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