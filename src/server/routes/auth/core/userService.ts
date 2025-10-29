import {
  createUser,
} from "../outbound/userRepository";
import { requireEnvVar } from "@logger/envcheck";
import { ErrorKeys } from "@errors/errors.types";
import { hashEmail, hashPassword } from "@services/encryption/hash";
import { encrypt } from '@services/encryption'

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