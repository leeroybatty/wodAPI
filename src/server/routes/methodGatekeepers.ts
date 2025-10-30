import { Response, Request } from 'express';
import { createErrorResponse } from '@errors';
import { ErrorKeys } from '@errors/errors.types';

export const onlyAcceptPost = function(req: Request, res: Response) {
    if (req.method !== 'POST') {
    const rejection = createErrorResponse(ErrorKeys.METHOD_NOT_ALLOWED);
    const {error} = rejection
    return res.status(error.code).json(error.message);
  }
}
  