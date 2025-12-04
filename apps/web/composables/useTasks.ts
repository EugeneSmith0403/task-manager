import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';

export interface ITask {
  id: string;
  title: string;
  description?: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateTaskDto {
  title: string;
  description?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;
}

export interface IUpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: string;
}

const config = useRuntimeConfig();

const apiBase = config.public.apiBase;

export const useTasksQuery = (status?: string, sortBy = 'dueDate') => {
  return useQuery({
    queryKey: ['tasks', status, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await fetch(`${apiBase}/tasks?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json() as Promise<ITask[]>;
    },
  });
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateTaskDto) => {
      const response = await fetch(`${apiBase}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create task');
      return response.json() as Promise<ITask>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IUpdateTaskDto }) => {
      const response = await fetch(`${apiBase}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update task');
      return response.json() as Promise<ITask>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${apiBase}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      return response.json() as Promise<ITask>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
