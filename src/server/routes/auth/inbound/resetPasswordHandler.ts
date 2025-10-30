import { Response, Request } from 'express';
import { resetPassword } from '../core/userService';
import { ErrorKeys } from '@errors/errors.types';
import { onlyAcceptPut } from '@server/routes/methodGatekeepers';
import { handleError, createSuccessResponse, ValidationError } from '@errors';

export const resetPasswordHandler = async (req: Request, res: Response) => {
  try {
    onlyAcceptPut(req, res);

    const { token } = req.params;
    const { newPassword, email } = req.body;

    if (!token) {
      throw new ValidationError(
        "Reset token required",
        "req.params.token",
        [],
        ErrorKeys.TOKEN_MISSING
      );
    }

    if (!email) {
      throw new ValidationError(
        "Email required",
        "req.body.email",
        [],
        ErrorKeys.EMAIL_REQUIRED
      );
    }

    if (!newPassword) {
      throw new ValidationError(
        "New password required",
        "req.body.newPassword",
        [],
        ErrorKeys.VALIDATION_ERROR
      );
    }

    if (newPassword.length < 8) {
      throw new ValidationError(
        "Password must be at least 8 characters",
        "req.body.newPassword",
        [],
        ErrorKeys.VALIDATION_ERROR
      );
    }
    await resetPassword(token, newPassword, email);
    return res.status(200).send('Password has been reset successfully.');
  } catch (error) {
    handleError(error, req, res);
  }
};