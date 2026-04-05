import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token is required', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Access token is required', 401);
    }

    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    // JWT errors
    const err = error as Error;
    if (err.name === 'TokenExpiredError') {
      next(new AppError('Access token has expired', 401));
      return;
    }

    if (err.name === 'JsonWebTokenError') {
      next(new AppError('Invalid access token', 401));
      return;
    }

    next(new AppError('Authentication failed', 401));
  }
};
