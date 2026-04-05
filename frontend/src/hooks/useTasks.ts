'use client';

import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import taskService from '@/services/taskService';
import { Task, PaginatedTasks, GetTasksParams, CreateTaskPayload, UpdateTaskPayload } from '@/types';

export function useTasks(initialParams: GetTasksParams = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginatedTasks['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<GetTasksParams>({ page: 1, limit: 10, ...initialParams });

  const fetchTasks = useCallback(async (fetchParams: GetTasksParams) => {
    setLoading(true);
    try {
      const result = await taskService.getTasks(fetchParams);
      setTasks(result.data);
      setPagination(result.pagination);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load tasks';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(params);
  }, [fetchTasks, params]);

  const updateParams = useCallback((newParams: Partial<GetTasksParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      // Reset to page 1 when filters/search change
      page: newParams.page ?? 1,
    }));
  }, []);

  const createTask = useCallback(
    async (payload: CreateTaskPayload) => {
      const task = await taskService.createTask(payload);
      toast.success('Task created!');
      fetchTasks(params);
      return task;
    },
    [fetchTasks, params]
  );

  const updateTask = useCallback(
    async (id: number, payload: UpdateTaskPayload) => {
      const task = await taskService.updateTask(id, payload);
      toast.success('Task updated!');
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      return task;
    },
    []
  );

  const deleteTask = useCallback(
    async (id: number) => {
      await taskService.deleteTask(id);
      toast.success('Task deleted!');
      fetchTasks(params);
    },
    [fetchTasks, params]
  );

  const toggleTask = useCallback(async (id: number) => {
    const task = await taskService.toggleTask(id);
    const label = task.status === 'completed' ? 'Task completed! 🎉' : 'Task reopened';
    toast.success(label);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    return task;
  }, []);

  const refresh = useCallback(() => fetchTasks(params), [fetchTasks, params]);

  return {
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
  };
}
