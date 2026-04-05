import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import config from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Prisma unique constraint violation
  if ((err as any).code === 'P2002') {
    res.status(400).json({
      success: false,
      message: 'A record with this value already exists',
    });
    return;
  }

  // Prisma not found
  if ((err as any).code === 'P2025') {
    res.status(404).json({
      success: false,
      message: 'Record not found',
    });
    return;
  }

  // Log unexpected errors in development
  if (config.nodeEnv === 'development') {
    console.error('Unexpected Error:', err);
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
