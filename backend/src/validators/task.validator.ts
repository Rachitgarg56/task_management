import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(1, 'Title cannot be empty')
      .max(255, 'Title must not exceed 255 characters')
      .trim(),
    description: z
      .string()
      .max(5000, 'Description must not exceed 5000 characters')
      .trim()
      .optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Title cannot be empty')
      .max(255, 'Title must not exceed 255 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .max(5000, 'Description must not exceed 5000 characters')
      .trim()
      .optional(),
    status: z.enum(['pending', 'completed']).optional(),
  }),
});

export const getTasksQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('10'),
    status: z.enum(['pending', 'completed']).optional(),
    search: z.string().trim().optional(),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>['body'];
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>['query'];
