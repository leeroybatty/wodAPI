import { Response, Request } from 'express';
import { offerPasswordReset } from '../core/userService';
import { ErrorKeys } from '@errors/errors.types';
import { onlyAcceptPost } from '@server/routes/methodGatekeepers';
import { handleError, createSuccessResponse, createErrorResponse, ValidationError } from '@errors';

export const requestPasswordResetHandler = async (req: Request, res: Response) => {
  try {
    onlyAcceptPost(req, res); 
    const requestEmail = req.body.email;
    if (!requestEmail) {
      throw new ValidationError(
        "Email required for password reset",
        "req.body.email",
        [],
        ErrorKeys.EMAIL_REQUIRED
      );
    }
    const result = await offerPasswordReset(requestEmail);
    return res.status(200).send('If that email exists in our system, a password reset link has been sent.');
  } catch (error) {
    handleError(error, req, res);
  }
};
