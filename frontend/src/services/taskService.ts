import api from './api';
import {
  Task,
  PaginatedTasks,
  GetTasksParams,
  CreateTaskPayload,
  UpdateTaskPayload,
} from '@/types';

const taskService = {
  async getTasks(params: GetTasksParams = {}): Promise<PaginatedTasks> {
    const queryParams: Record<string, string> = {};
    if (params.page) queryParams.page = String(params.page);
    if (params.limit) queryParams.limit = String(params.limit);
    if (params.status) queryParams.status = params.status;
    if (params.search) queryParams.search = params.search;

    const { data } = await api.get('/tasks', { params: queryParams });
    return data.data as PaginatedTasks;
  },

  async getTaskById(id: number): Promise<Task> {
    const { data } = await api.get(`/tasks/${id}`);
    return data.data as Task;
  },

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const { data } = await api.post('/tasks', payload);
    return data.data as Task;
  },

  async updateTask(id: number, payload: UpdateTaskPayload): Promise<Task> {
    const { data } = await api.patch(`/tasks/${id}`, payload);
    return data.data as Task;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async toggleTask(id: number): Promise<Task> {
    const { data } = await api.patch(`/tasks/${id}/toggle`);
    return data.data as Task;
  },
};

export default taskService;
