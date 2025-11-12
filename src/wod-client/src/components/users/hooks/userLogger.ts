/**
 * This module is responsible for logging user-related actions in a structured
 * and consistent manner. By leveraging a series of predefined logging actions,
 * the system is able to provide detailed logs during development, and more concise
 * logs in production environments.
 *
 * I personally recommend that you not feel too bad if your eyes glaze right
 * over when you read it because it's as dry as Luby's chicken breast.
 *
 * Regardless, the logger is designed to cater to two environments:
 * - Development: Detailed logs include specifics for debugging.
 * - Production: Brief logs that fail to be specific on purpose for security.
 *
 * Development is when you're typing away at your laptop at home, code forged
 * in goldfish crumbs and cathair, so it's okay to have all the details logged.
 * But production is when your code is available for anybody on the Internet to
 * mess with, including hackers who may leverage error information if you tell
 * them too much.
 *
 * The decision between detailed and concise logs is made based on the `NODE_ENV`
 * environment variable, which is 'development' when you run `npm run dev`.
 *
 * There are several predefined logging actions, each handling a specific type of
 * user action like login, logout, etc. The 'loggerMap' connects these log actions
 * with their respective actionTypes to provide more streamlined logging.
 *
 * As-is, the UserActionLogger is set up to automatically fire off without you
 * doing anything to invoke it and all this documentation is for learning purposes.
 *
 * @module UserActionLogger
 *
 * @exports {Object} logActions - A set of predefined logging actions.
 * @exports {Object} loggerMap - A map connecting actionTypes to their respective log actions.
 *
 * @example
 * // Assuming you have an action and payload:
 * const actionType = ActionType.Login;
 * const payload = { id: '123', source: 'web' };
 *
 * // Using loggerMap to log the action:
 * const logAction = loggerMap[actionType];
 * if (logAction) {
 *   logAction(payload);
 * }
 */

import { logger } from "@services/logger";
import type { 
  LoginLoggerPayload,
  VerifyLoggerPayload,
  LogoutLoggerPayload,
  ErrorLoggerPayload,
  LoadingLoggerPayload,
  ViewProfileLoggerPayload,
  UpdateProfileLoggerPayload
} from "../user.types";
import { 
  ActionType
} from "../user.types";
export const dev = process.env.NODE_ENV === "development";

export const logActions = {
  LOGIN: (payload: LoginLoggerPayload) => {
    const { id } = payload.user;
    logger.info(
      `${
        dev
          ? `User [ID: ${id}] logged in from ${payload.source}`
          : "User logged in"
      }`,
    );
  },
  VERIFY: (payload: VerifyLoggerPayload) => {
    const { user } = payload.auth;
    logger.info(
      `${
        dev && user
          ? `User [ID: ${user.id}] verified as still logged in`
          : "User authentication verified"
      }`,
    );
  },
  LOGOUT: (payload: LogoutLoggerPayload) => {
    // TODO: maybe log logout reason, e.g. session expiry or deliberate
    const { id } = payload.user;
    logger.info(
      `${
        dev
          ? `User [ID: ${id}] logged out: ${payload.reason}`
          : "User logged out"
      }`,
    );
  },
  ERROR: (payload: ErrorLoggerPayload) => {
    const { message, stack } = payload;
    if (dev) {
      logger.log(`Error occured: ${message}`);
      logger.log(stack);
    }
    logger.log(`Error occurred: ${message}`);
  },
  LOADING: (payload: LoadingLoggerPayload) => {
    if (dev) {
      logger.info(
        `Loading started for ${payload.process} at ${new Date().toISOString()}`,
      );
    }
  },
  VIEW_PROFILE: (payload: ViewProfileLoggerPayload) => {
    const { email } = payload.user;
    logger.log(`User profile view for user ${email}`);
  },
  UPDATE_PROFILE: (payload: UpdateProfileLoggerPayload) => {
    // TODO: maybe log the fields updated (not the actual values).
    const { id, name } = payload.user;
    logger.log(`User profile update for user ${id || name}`);
  },
};

type LoggerActionsMap = {
  [K in ActionType]?: (payload: any) => void;
};

export const loggerMap: LoggerActionsMap = {
  [ActionType.Login]: logActions.LOGIN,
  [ActionType.Logout]: logActions.LOGOUT,
  [ActionType.Verify]: logActions.VERIFY,
  [ActionType.ViewProfile]: logActions.VIEW_PROFILE,
  [ActionType.UpdateProfile]: logActions.UPDATE_PROFILE,
  [ActionType.Error]: logActions.ERROR,
  [ActionType.Loading]: logActions.LOADING,
};
