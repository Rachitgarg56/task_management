'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, LogOut, CheckSquare, ListTodo, CheckCheck, Clock, RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { TaskList } from '@/components/TaskList/TaskList';
import { TaskForm } from '@/components/TaskForm/TaskForm';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { FilterDropdown } from '@/components/FilterDropdown/FilterDropdown';
import { Pagination } from '@/components/Pagination/Pagination';
import { Modal } from '@/components/Modal/Modal';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { Task } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  const {
    tasks,
    pagination,
    loading,
    params,
    updateParams,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    refresh,
  } = useTasks({ page: 1, limit: 10 });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router, mounted]);

  if (!mounted) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  const handleCreate = async (data: { title: string; description?: string }) => {
    setFormLoading(true);
    try {
      await createTask(data);
      setShowCreateModal(false);
    } catch {
      // handled in hook
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: { title: string; description?: string }) => {
    if (!editingTask) return;
    setFormLoading(true);
    try {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    } catch {
      // handled in hook
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (task: Task) => setEditingTask(task);

  const totalCount = pagination?.total ?? 0;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;

  return (
    <div className="min-h-screen">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-brand-700/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0f172a]/80 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              TaskFlow
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-slate-400">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors p-1.5 rounded-lg hover:bg-surface-hover"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Welcome + Stats */}
        <div>
          <h1 className="font-display text-xl font-bold text-white mb-4">
            Good work,{' '}
            <span className="text-brand-400">{user?.name?.split(' ')[0]}</span>
          </h1>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total tasks', value: totalCount, icon: ListTodo, color: 'text-slate-400', bg: 'bg-slate-500/10' },
              { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Completed', value: completedCount, icon: CheckCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card p-4 text-center">
                <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-2xl font-display font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <SearchBar
              value={params.search ?? ''}
              onChange={(search) => updateParams({ search, page: 1 })}
            />
          </div>
          <div className="w-full sm:w-40">
            <FilterDropdown
              value={params.status ?? ''}
              onChange={(status) => updateParams({ status, page: 1 })}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={refresh}
              disabled={loading}
              className="btn-secondary px-3"
              aria-label="Refresh tasks"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              New task
            </button>
          </div>
        </div>

        {/* Task list */}
        <div>
          <TaskList
            tasks={tasks}
            loading={loading}
            onToggle={toggleTask}
            onEdit={handleEdit}
            onDelete={deleteTask}
          />

          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={(page) => updateParams({ page })}
            />
          )}
        </div>
      </main>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create new task"
      >
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={formLoading}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit task"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleUpdate}
          onCancel={() => setEditingTask(null)}
          isLoading={formLoading}
        />
      </Modal>
    </div>
  );
}
