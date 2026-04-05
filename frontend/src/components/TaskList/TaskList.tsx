'use client';

import { Task } from '@/types';
import { TaskItem } from '@/components/TaskItem/TaskItem';
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggle: (id: number) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => Promise<void>;
}

export function TaskList({ tasks, loading, onToggle, onEdit, onDelete }: TaskListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-surface-hover flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-hover rounded w-3/4" />
                <div className="h-3 bg-surface-hover rounded w-1/2" />
                <div className="h-5 bg-surface-hover rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="card p-12 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-surface-hover flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-7 h-7 text-slate-600" />
        </div>
        <p className="text-slate-400 font-medium">No tasks found</p>
        <p className="text-slate-600 text-sm mt-1">Create a task or adjust your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-fade-in">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
