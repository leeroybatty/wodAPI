import { Response, Request } from 'express';
import { ErrorKeys } from '../errors.types'
import { registerUser } from '../core/userService';
import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';

export const signupHandler = async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    const rejection = createErrorResponse(ErrorKeys.METHOD_NOT_ALLOWED);
    return res.status(rejection.statusCode).json(rejection);
  }
  try {
    const {password, name, email} = req.body;
    const result = await registerUser(password, name, email);
    if (result.success) {
      return res.status(200).send("success")
    } else {
      return res.status(result.error === ErrorKeys.GENERAL_SERVER_ERROR ? 500 : 400).send(result.error);
    }
  } catch (error) {
    handleError(error, req, res)
  } 
};

export default signupHandler;