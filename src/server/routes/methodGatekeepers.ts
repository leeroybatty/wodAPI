import { Response, Request } from 'express';
import { createErrorResponse } from '@errors';
import { ErrorKeys } from '@errors/errors.types';

export const onlyAcceptPost = function(req: Request, res: Response) {
    if (req.method !== 'POST') {
    const rejection = createErrorResponse(ErrorKeys.METHOD_NOT_ALLOWED);
  return res.status(405).json(rejection.error.message);
  }
}

export const onlyAcceptPut = function(req: Request, res: Response) {
    if (req.method !== 'PUT') {
    const rejection = createErrorResponse(ErrorKeys.METHOD_NOT_ALLOWED);
    return res.status(405).json(rejection.error.message);
  }
}

export const onlyAcceptGet = function(req: Request, res: Response) {
    if (req.method !== 'GET') {
    const rejection = createErrorResponse(ErrorKeys.METHOD_NOT_ALLOWED);
    return res.status(405).json(rejection.error.message);
  }
}