import { ApiResponse, ApiErrorResponse, ApiSuccessResponse } from '../apiResponse.types'
import { ErrorKeys } from './errors.types';
import { Request, Response } from 'express';
import { CORE_ERROR_MAP, getPublicError } from './errorMap';
import { logger } from '@logger';

export class ValidationError extends Error {
  constructor(
    message: string, 
    public query: string, 
    public params: any[], 
    public errorKey: ErrorKeys = ErrorKeys.VALIDATION_ERROR
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class QueryExecutionError extends Error {
  constructor(
    message: string, 
    public query: string, 
    public params: any[], 
    public errorKey: ErrorKeys = ErrorKeys.GENERAL_SERVER_ERROR
  ) {
    super(message);
    this.name = 'QueryExecutionError';
  }
}

export function createSuccessResponse<T>(data?: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data
  };
}

export function createErrorResponse(
  errorKey: ErrorKeys, 
  details?: any, 
  endpoint?: string
): ApiErrorResponse {
  const publicErrorInfo = getPublicError(errorKey);
  
  const internalError = CORE_ERROR_MAP[errorKey];
  const publicErrorKey = internalError && 'spoof' in internalError 
    ? internalError.spoof
    : errorKey;
  
  return {
    success: false,
    error: {
      code: publicErrorKey,
      message: publicErrorInfo.message,
      details,
      endpoint
    }
  };
}

function shouldLogEvent(errorKey: ErrorKeys): boolean {
  const eventsToLog = [
    ErrorKeys.CREDENTIALS_MISSING,
    ErrorKeys.EMAIL_INVALID,
    ErrorKeys.SESSION_MISSING
  ];
  
  return eventsToLog.includes(errorKey);
}

export function handleError(error: any, req: Request, res: Response): void {
  if (error instanceof QueryExecutionError || error instanceof ValidationError) {
    
    if (shouldLogEvent(error.errorKey)) {
      logger.log({
        errorKey: error.errorKey,
        details: error.message,
        endpoint: req.path
      });
    }

    else {
      logger.error({
        errorKey: error.errorKey,
        details: error.message,
        endpoint: req.path
      });
    }
    
    const errorResponse = createErrorResponse(error.errorKey, error.message, req.path);
    const publicErrorInfo = getPublicError(error.errorKey);
    res.status(publicErrorInfo.statusCode).json(errorResponse);
    return;
  }

  const errorResponse = createErrorResponse(ErrorKeys.GENERAL_SERVER_ERROR, undefined, req.path);
  res.status(500).json(errorResponse);
}