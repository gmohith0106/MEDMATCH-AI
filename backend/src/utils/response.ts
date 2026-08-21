import { Response } from 'express';
import { ErrorCode } from './errors';

export interface ApiResponseSuccess<T> {
  success: true;
  data: T;
}

export interface ApiResponseError {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
}

export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200): Response {
  const responseBody: ApiResponseSuccess<T> = {
    success: true,
    data
  };
  return res.status(statusCode).json(responseBody);
}

export function sendError(
  res: Response,
  code: ErrorCode,
  message: string,
  statusCode: number = 500,
  details?: unknown
): Response {
  const responseBody: ApiResponseError = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  };
  return res.status(statusCode).json(responseBody);
}
