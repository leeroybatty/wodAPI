import { CORE_ERROR_MAP } from './errorMap';
import { ApiResponse, ApiErrorResponse, ApiSuccessResponse } from '../apiResponse.types'
import { QueryExecutionError, ValidationError } from '../sql';
import { ErrorKeys } from './errors.types';
import { Request, Response } from 'express';

export function createErrorResponse(
  errorKey: ErrorKeys, 
  details?: any, 
  endpoint?: string
): ApiErrorResponse {
  const errorInfo = CORE_ERROR_MAP[errorKey];
  return {
    success: false,
    error: {
      code: errorKey,
      message: errorInfo.message,
      details,
      endpoint
    }
  };
}

export function handleError(error: any, req: Request, res: Response): void {
  if (error instanceof QueryExecutionError || error instanceof ValidationError) {
    const errorResponse = createErrorResponse(error.errorKey, error.message, req.path);
    res.status(CORE_ERROR_MAP[error.errorKey].statusCode).json(errorResponse);
    return;
  }
  
  const errorResponse = createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR, undefined, req.path);
  res.status(500).json(errorResponse);
}