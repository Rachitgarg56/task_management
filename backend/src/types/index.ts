import { Request } from 'express';
import { TaskStatus } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export interface JwtPayload {
  userId: number;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

export { TaskStatus };
