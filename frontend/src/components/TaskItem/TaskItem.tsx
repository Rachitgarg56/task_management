'use client';

import { useState } from 'react';
import { Check, Pencil, Trash2, Clock, Calendar } from 'lucide-react';
import { Task } from '@/types';
import { clsx } from 'clsx';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => Promise<void>;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isCompleted = task.status === 'completed';

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle(task.id);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    setDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className={clsx(
        'group card p-4 transition-all duration-200 hover:border-slate-600',
        isCompleted && 'opacity-70'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Toggle checkbox */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={clsx(
            'mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
            isCompleted
              ? 'bg-brand-500 border-brand-500'
              : 'border-slate-600 hover:border-brand-400',
            toggling && 'opacity-50 cursor-not-allowed'
          )}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={clsx(
              'text-sm font-medium leading-snug break-words',
              isCompleted ? 'line-through text-slate-500' : 'text-slate-200'
            )}
          >
            {task.title}
          </p>

          {task.description && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2 break-words">
              {task.description}
            </p>
          )}

          <div className="mt-2 flex items-center gap-3">
            <span
              className={clsx(
                'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium',
                isCompleted
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-400'
              )}
            >
              {isCompleted ? (
                <Check className="w-2.5 h-2.5" />
              ) : (
                <Clock className="w-2.5 h-2.5" />
              )}
              {isCompleted ? 'Completed' : 'Pending'}
            </span>

            <span className="flex items-center gap-1 text-xs text-slate-600">
              <Calendar className="w-2.5 h-2.5" />
              {formatDate(task.createdAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
            aria-label="Edit task"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
            aria-label="Delete task"
          >
            {deleting ? (
              <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin block" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
