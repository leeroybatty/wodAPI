import { createUserSessionCookie } from "../outbound/userSessionCookie";
import {
  createUser,
  getUserCredentials,
  getPasswordResetCredentials,
  clearUserSession,
  getUser,
  editUser,
} from "../outbound/userRepository";
import jwt from "jsonwebtoken";
import { requireEnvVar } from "../../../services/logger/envcheck";
import { ErrorKeys } from "../errors.types";
import logger from "../../../services/logger";
import { User, UserCredentials } from "../user.types";
import { encrypt, decrypt } from "@services/encryption";
import { sendSingleEmail } from "../../../services/emailer";

const SECRET_KEY_JWT = requireEnvVar("SECRET_KEY_JWT");

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
      error: ErrorKeys.EMAIL_INVALID,
    };
  }

  const validUsername = /^[a-zA-Z0-9_-]+$/;
  if (!validUsername.test(name)) {
    return {
      success: false,
      error: ErrorKeys.USERNAME_INVALID,
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