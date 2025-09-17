import { ErrorKeys as CoreErrors } from './errors.types';

export type ApplicationErrorKey = 
  | CoreErrors;

export interface ApiSuccessResponse<T> {
  success: true;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApplicationErrorKey;
    message: string;
    details?: any;
    endpoint?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function createSuccessResponse<T>(data?: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data
  };
}

export function createErrorResponse(
  code: ApplicationErrorKey,
  message: string,
  details?: any,
  endpoint?: string
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
      endpoint
    }
  };
}