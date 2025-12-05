<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <h1 class="text-3xl font-bold mb-4">{{ $t('tasks.edit') }} {{ taskId }}</h1>
    <TaskForm v-if="task" :initial-data="task" @submit="handleSubmit" @cancel="handleCancel" />
  </div>
</template>

<script setup lang="ts">
import TaskForm from '~/components/TaskForm.vue';
import { useUpdateTaskMutation, useTasksQuery } from '~/composables/useTasks';

const route = useRoute();
const router = useRouter();
const taskId = route.params.id as string;

useHead({
  title: 'Edit Task',
});

const { data: tasks } = useTasksQuery();
const task = computed(() => tasks.value?.find((t) => t.id === taskId));

const updateMutation = useUpdateTaskMutation();

const handleSubmit = async (data: unknown): Promise<void> => {
  await updateMutation.mutateAsync({
    id: taskId,
    data: data as Parameters<typeof updateMutation.mutateAsync>[0]['data'],
  });
  router.push('/tasks');
};

const handleCancel = (): void => {
  router.push('/tasks');
};
</script>
