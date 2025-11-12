import { Response, Request } from 'express';
import { ErrorKeys } from '@errors/errors.types'
import { loginUser } from '../core/userService';
import { handleError, createSuccessResponse, createErrorResponse } from '@errors';
import { onlyAcceptPost } from '@server/routes/methodGatekeepers';

export const loginHandler = async (req: Request, res: Response) => {
  try {
    onlyAcceptPost(req, res);
    const { password, email } = req.body;
    
    if (!email || !password) {
      const errorResponse = createErrorResponse(
        ErrorKeys.CREDENTIALS_INVALID,
        undefined,
        req.path
      );
      return res.status(403).json(errorResponse);
    }
    
    const result = await loginUser(email, password);

    if (result.success && result.sessionCookie) {
      res.setHeader('Set-Cookie', result.sessionCookie);
      return res.status(200).json({
        id: result.userId,
        user: result.username,
      });
    }

    const errorResponse = createErrorResponse(
      ErrorKeys.CREDENTIALS_INVALID,
      undefined,
      req.path
    );
    return res.status(403).json(errorResponse);

  } catch (error) {
    handleError(error, req, res);
  } 
};

export default loginHandler;