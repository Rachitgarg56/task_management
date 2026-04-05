import { TaskStatus } from '@prisma/client';
import prisma from '../config/database';
import { AppError } from '../utils/AppError';
import { PaginatedResponse } from '../types';
import { CreateTaskInput, UpdateTaskInput } from '../validators/task.validator';

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

export class TaskService {
  async getTasks(
    userId: number,
    page: number,
    limit: number,
    status?: TaskStatus,
    search?: string
  ): Promise<PaginatedResponse<Task>> {
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(status && { status }),
      ...(search && {
        title: {
          contains: search,
        },
      }),
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getTaskById(id: number, userId: number): Promise<Task> {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (task.userId !== userId) {
      throw new AppError('You are not authorized to access this task', 403);
    }

    return task;
  }

  async createTask(userId: number, input: CreateTaskInput): Promise<Task> {
    return prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        userId,
      },
    });
  }

  async updateTask(id: number, userId: number, input: UpdateTaskInput): Promise<Task> {
    await this.getTaskById(id, userId);

    return prisma.task.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.status !== undefined && { status: input.status as TaskStatus }),
      },
    });
  }

  async deleteTask(id: number, userId: number): Promise<void> {
    await this.getTaskById(id, userId);
    await prisma.task.delete({ where: { id } });
  }

  async toggleTask(id: number, userId: number): Promise<Task> {
    const task = await this.getTaskById(id, userId);

    const newStatus: TaskStatus = task.status === 'pending' ? 'completed' : 'pending';

    return prisma.task.update({
      where: { id },
      data: { status: newStatus },
    });
  }
}

export default new TaskService();
