import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    logger.warn(`AppError [${err.code}]: ${err.message}`, { details: err.details });
    sendError(res, err.code, err.message, err.statusCode, err.details);
    return;
  }

  // Unhandled internal server error
  logger.error('Unhandled Server Error', {
    name: err.name,
    message: err.message
  });

  // Never expose internal stack traces or secrets
  sendError(
    res,
    'INTERNAL_ERROR',
    'An unexpected error occurred while processing your request. Please try again later.',
    500
  );
}
