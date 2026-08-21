import { Request, Response } from 'express';
import { sendError } from '../utils/response';

export function notFoundHandler(req: Request, res: Response): void {
  sendError(
    res,
    'RESOURCE_NOT_FOUND',
    `Cannot find requested route ${req.method} ${req.originalUrl}`,
    404
  );
}
