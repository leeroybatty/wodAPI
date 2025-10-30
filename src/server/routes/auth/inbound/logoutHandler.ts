import { Response, Request } from 'express';
import { logoutUser } from '../core/userService';
import { requireEnvVar } from '@server/services/logger/envcheck';
import { ErrorKeys } from '@errors/errors.types';
import { handleError, ValidationError } from '@errors';
import { onlyAcceptPost } from '@server/routes/methodGatekeepers';

const USER_AUTH_TOKEN_NAME = requireEnvVar("USER_AUTH_TOKEN_NAME");

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    onlyAcceptPost(req, res);
    const token = req.cookies[USER_AUTH_TOKEN_NAME];
    if (!token) {
      throw new ValidationError(
        "No token provided for logout",
        "req.cookies",
        [],
        ErrorKeys.TOKEN_MISSING
      );
    }
    const result = await logoutUser(token);
    res.setHeader('Set-Cookie', `${USER_AUTH_TOKEN_NAME}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
    return res.status(200).send('Logged out successfully.');
  } catch (error) {
    handleError(error, req, res);
  }
};