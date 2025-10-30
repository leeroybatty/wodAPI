import { Response, Request } from 'express';
import { ErrorKeys } from '@errors/errors.types'
import { loginUser } from '../core/userService';
import { handleError, createSuccessResponse } from '@errors';
import { onlyAcceptPost } from '@server/routes/methodGatekeepers';

export const loginHandler = async (req: Request, res: Response) => {
  onlyAcceptPost(req, res);
  try {
    const {password, name, email} = req.body;
    const result = await loginUser({password, email});

    if (result.success && result.sessionCookie) {
      res.setHeader('Set-Cookie', result.sessionCookie);
      return res.status(200).send({
        id: result.userId,
        user: result.username,
      });
    }

    return res.status(403).send({ error: ErrorKeys.CREDENTIALS_INVALID });

  } catch (error) {
    handleError(error, req, res)
  } 
};

export default loginHandler;

