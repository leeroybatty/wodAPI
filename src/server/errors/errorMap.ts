import { ErrorKeys } from './errors.types';

interface ErrorInfo {
  message: string;
  statusCode: number;
}

export const CORE_ERROR_MAP: Record<ErrorKeys, ErrorInfo> = {
  [ErrorKeys.GENERAL_SERVER_ERROR]: {
    message: "Unknown general server error.",
    statusCode: 500
  },
  [ErrorKeys.USER_NOT_AUTHORIZED]: {
    message: "I'm afraid I can't let you do that, dave",
    statusCode: 403
  },
   [ErrorKeys.INVALID_REQUEST]: {
    message: "There's some issue with your request, look it over.",
    statusCode: 400
  },
  [ErrorKeys.RESOURCE_NOT_FOUND]: {
    message: "Whatever you are trying to access doesn't appear to exist.",
    statusCode: 404
  },
  [ErrorKeys.RATE_LIMIT_EXCEEDED]: {
    message: "Slow down, brochacho! Do you need to drink some water?",
    statusCode: 429
  },
  [ErrorKeys.VALIDATION_ERROR]: {
    message: "Your request couldn't be validated.",
    statusCode: 400
  },
  [ErrorKeys.AUTHENTICATION_FAILED]: {
    message: "Please make sure you're properly logged in.",
    statusCode: 401
  },
  [ErrorKeys.METHOD_NOT_ALLOWED]: {
    message: "The HTTP method you're using is not allowed.",
    statusCode: 405
  },
  [ErrorKeys.ACCESS_DENIED]: {
    message: "You don't have permission.",
    statusCode: 403
  },
  [ErrorKeys.MONSTER_TYPE_NOT_FOUND]: {
    message: "No such monster type found.",
    statusCode: 404
  },
  [ErrorKeys.STAT_TYPE_NOT_FOUND]: {
    message: "No such stat type found.",
    statusCode: 404
  },
  [ErrorKeys.SESSION_INVALID]: {
    message: "You need to be properly logged in.",
    statusCode: 401
  },
  [ErrorKeys.EMAIL_INVALID]: {
    message: "Could not log in.",
    statusCode: 403
  },
  [ErrorKeys.USERNAME_INVALID]: {
    message: "Could not log in.",
    statusCode: 403
  }
  [ErrorKeys.EMAIL_TAKEN]: {
    message: "Please use a different email address.",
    statusCode: 400
  },
  [ErrorKeys.USERNAME_TAKEN]: {
    message: "Please use a different username.",
    statusCode: 400
  }
}