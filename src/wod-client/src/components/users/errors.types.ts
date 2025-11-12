export enum ErrorKeys {
  EMAIL_INVALID = "Please use a valid email address.",
  EMAIL_TAKEN = "Please use a different email.",
  EMAIL_MISSING = "Please enter a valid email address.",
  PASSWORD_MISSING = "Please enter a password.",
  PASSWORD_SHORT = "Your password needs to be at least 8 characters.",
  PASSWORD_MISMATCH = "Passwords do not match.",
  CREDENTIALS_INVALID = "Could not log in.",
  GENERAL_SUBMISSION_ERROR = "Please check your input and try again.",
  TOKEN_MISSING = "You haven't been logged in properly.",
  TOKEN_INVALID = "Your log-in may have expired.",
  SESSION_MISSING = "You aren't logged in.",
  SESSION_INVALID = "You aren't properly logged in.",
  GENERAL_SERVER_ERROR = "An error happened on the server. Try again.",
  RESET_TOKEN_MISSING = "You need a valid password reset token.",
  RESET_TOKEN_EXPIRED = "This password reset token is expired.",
  USER_INVALID = "This is not a valid user."
}