export type TaskStatus = 'pending' | 'completed';

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedTasks {
  data: Task[];
  pagination: Pagination;
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface GetTasksParams {
  page?: number;
  limit?: number;
  status?: TaskStatus | '';
  search?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
