<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold">{{ $t('tasks.title') }}</h1>
      <NuxtLink to="/tasks/new" class="btn-primary">
        {{ $t('tasks.create') }}
      </NuxtLink>
    </div>

    <TasksTable
      :tasks="tasks || []"
      :show-filter="true"
      :filter-label="$t('tasks.filter')"
      @filter-change="handleFilterChange"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { TasksTable } from '@task-manager/ui';
import { useTasksQuery, useDeleteTaskMutation } from '~/composables/useTasks';

useHead({
  title: 'Tasks',
});

const selectedStatus = ref<string | null>(null);
const sortBy = ref('dueDate');

const { data: tasks, isLoading } = useTasksQuery(selectedStatus.value || undefined, sortBy.value);

const deleteMutation = useDeleteTaskMutation();

const handleFilterChange = (status: string | null): void => {
  selectedStatus.value = status;
};

const handleEdit = (task: { id: string }): void => {
  navigateTo(`/tasks/${task.id}`);
};

const handleDelete = async (task: { id: string }): Promise<void> => {
  if (confirm('Are you sure you want to delete this task?')) {
    await deleteMutation.mutateAsync(task.id);
  }
};
</script>
