'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Plus } from 'lucide-react';
import { Task } from '@/types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().max(5000, 'Description too long').optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
    },
  });

  useEffect(() => {
    reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
    });
  }, [task, reset]);

  const handleFormSubmit = async (data: TaskFormData) => {
    await onSubmit(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
        <div>
          <label className="label">Title *</label>
          <input
            {...register('title')}
            type="text"
            className="input-field"
            placeholder="What needs to be done?"
            autoFocus
          />
          {errors.title && <p className="error-text">{errors.title.message}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="input-field resize-none"
            placeholder="Add more details (optional)"
          />
          {errors.description && <p className="error-text">{errors.description.message}</p>}
        </div>

        <div className="flex gap-2 pt-1">
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              <>
                <Save className="w-3.5 h-3.5" />
                Save changes
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Create task
              </>
            )}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

