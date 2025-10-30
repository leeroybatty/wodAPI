import { Response, Request } from 'express';
import { ErrorKeys } from '@errors/errors.types'
import { registerUser } from '../core/userService';
import { handleError } from '@errors';
import { onlyAcceptPost } from '@server/routes/methodGatekeepers';

export const signupHandler = async (req: Request, res: Response) => {
  onlyAcceptPost(req, res);
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