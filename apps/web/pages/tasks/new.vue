<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <h1 class="text-3xl font-bold mb-4">{{ $t('tasks.create') }}</h1>
    <TaskForm @submit="handleSubmit" @cancel="handleCancel" />
  </div>
</template>

<script setup lang="ts">
import TaskForm from '~/components/TaskForm.vue';
import { useCreateTaskMutation } from '~/composables/useTasks';

useHead({
  title: 'Create Task',
});

const createMutation = useCreateTaskMutation();
const router = useRouter();

const handleSubmit = async (data: unknown): Promise<void> => {
  await createMutation.mutateAsync(data as Parameters<typeof createMutation.mutateAsync>[0]);
  router.push('/tasks');
};

const handleCancel = (): void => {
  router.push('/tasks');
};
</script>
