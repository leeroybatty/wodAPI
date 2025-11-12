import { Response, Request } from 'express';
import { requireEnvVar } from '@server/services/logger/envcheck';
import { handleError } from '@errors';
import { onlyAcceptPost } from '@server/routes/methodGatekeepers';

const USER_AUTH_TOKEN_NAME = requireEnvVar("USER_AUTH_TOKEN_NAME");

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    onlyAcceptPost(req, res);
    res.clearCookie(USER_AUTH_TOKEN_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    });
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    handleError(error, req, res);
  }
};