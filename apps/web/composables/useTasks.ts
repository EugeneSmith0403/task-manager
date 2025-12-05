import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { computed, toValue, type Ref, type ComputedRef } from 'vue';

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

function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.apiBase;
}

export interface ITasksQueryParams {
  title?: string;
  status?: string[];
  sortBy?: string;
}

export const useTasksQuery = (params?: ITasksQueryParams | Ref<ITasksQueryParams> | ComputedRef<ITasksQueryParams>) => {
  const apiBase = getApiBase();
  
  const reactiveParams = computed(() => {
    const rawParams = toValue(params);
    return {
      title: rawParams?.title,
      status: rawParams?.status,
      sortBy: rawParams?.sortBy || 'dueDate',
    };
  });

  return useQuery({
    queryKey: computed(() => [
      'tasks',
      reactiveParams.value.title,
      reactiveParams.value.status,
      reactiveParams.value.sortBy,
    ]),
    queryFn: async () => {
      const { title, status, sortBy } = reactiveParams.value;
      const searchParams = new URLSearchParams();
      if (title) searchParams.append('title', title);
      if (status && status.length > 0) {
        searchParams.append('status', status.join(','));
      }
      if (sortBy) searchParams.append('sortBy', sortBy);

      const response = await fetch(`${apiBase}/tasks?${searchParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const result = await response.json() as { data?: ITask[]; meta?: unknown } | ITask[];
      return Array.isArray(result) ? result : (result.data || []);
    },
  });
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  const apiBase = getApiBase();

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
  const apiBase = getApiBase();

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
  const apiBase = getApiBase();

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
