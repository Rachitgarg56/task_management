import { Response, NextFunction } from 'express';
import { TaskStatus } from '@prisma/client';
import taskService from '../services/task.service';
import { sendSuccess } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';

export class TaskController {
  async getTasks(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
      const status = req.query.status as TaskStatus | undefined;
      const search = req.query.search as string | undefined;

      const result = await taskService.getTasks(userId, page, limit, status, search);

      sendSuccess(res, 'Tasks retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const taskId = parseInt(req.params.id);

      const task = await taskService.getTaskById(taskId, userId);

      sendSuccess(res, 'Task retrieved successfully', task);
    } catch (error) {
      next(error);
    }
  }

  async createTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const task = await taskService.createTask(userId, req.body);

      sendSuccess(res, 'Task created successfully', task, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const taskId = parseInt(req.params.id);

      const task = await taskService.updateTask(taskId, userId, req.body);

      sendSuccess(res, 'Task updated successfully', task);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const taskId = parseInt(req.params.id);

      await taskService.deleteTask(taskId, userId);

      sendSuccess(res, 'Task deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async toggleTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const taskId = parseInt(req.params.id);

      const task = await taskService.toggleTask(taskId, userId);

      sendSuccess(res, `Task marked as ${task.status}`, task);
    } catch (error) {
      next(error);
    }
  }
}

export default new TaskController();
