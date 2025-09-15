import { ErrorKeys as CoreErrors } from './errors.types';

export type ApplicationErrorKey = 
  | CoreErrors;

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
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