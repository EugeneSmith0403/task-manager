<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold">{{ $t('tasks.title') }}</h1>
      <v-btn
        :to="'/tasks/new'"
        color="primary"
      >
        {{ $t('tasks.create') }}
      </v-btn>
    </div>

    <Filters
      :filters="filterConfigs"
      :model-value="activeFilters"
      @update:model-value="handleFiltersChange"
      @filters-change="handleFiltersChange"
    />

    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <DataTable
      v-else
      :items="tasks || []"
      :columns="columns"
      :actions-label="$t('tasks.actions')"
      :actions-width="'200px'"
      :empty-message="$t('tasks.noData')"
      @sort-change="handleSortChange"
    >
      <template #actions="{ item }">
        <div class="flex gap-2">
          <v-btn
            @click="handleEdit(item)"
            color="primary"
            variant="outlined"
            size="small"
            class="flex-shrink-0 justify-center"
          >
            {{ $t('tasks.edit') }}
          </v-btn>
          <v-btn
            @click="handleDelete(item)"
            color="error"
            variant="outlined"
            size="small"
            class="flex-shrink-0 justify-center"
          >
            {{ $t('tasks.delete') }}
          </v-btn>
        </div>
      </template>
    </DataTable>

    <DeleteTaskDialog
      v-model="deleteDialog"
      :task="taskToDelete"
      :loading="isDeleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { DataTable, Filters, type ColumnConfig, type FilterConfig } from '@task-manager/ui';
import { useTasksQuery, useDeleteTaskMutation, type ITask } from '~/composables/useTasks';
import { useTaskFilters } from '~/composables/useTaskFilters';
import DeleteTaskDialog from '~/components/DeleteTaskDialog.vue';

useHead({
  title: 'Tasks',
});

const {
  activeFilters,
  queryParams,
  handleFiltersChange,
  handleSortChange,
} = useTaskFilters();

const { data: tasks, isLoading } = useTasksQuery(queryParams);

const deleteMutation = useDeleteTaskMutation();

const deleteDialog = ref(false);
const taskToDelete = ref<ITask | null>(null);

const isDeleting = computed(() => deleteMutation.isPending.value);

const columns: ColumnConfig<ITask>[] = [
  {
    key: 'title',
    label: 'Title',
    sortable: true,
    width: '200px',
  },
  {
    key: 'description',
    label: 'Description',
    sortable: true,
    width: '300px',
    formatter: (value: string | null | undefined) => {
      if (!value) return '';
      return value.length > 50 ? `${value.substring(0, 50)}...` : value;
    },
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: '150px',
    formatter: (value: string) => {
      const statusMap: Record<string, string> = {
        PENDING: 'Pending',
        IN_PROGRESS: 'In Progress',
        COMPLETED: 'Completed',
      };
      return statusMap[value] || value;
    },
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    sortable: true,
    width: '150px',
    formatter: (value: string | Date) => {
      const d = typeof value === 'string' ? new Date(value) : value;
      return d.toLocaleDateString();
    },
  },
];

const filterConfigs: FilterConfig[] = [
  {
    key: 'search',
    type: 'text',
    label: 'Search by title',
    placeholder: 'Enter task title...',
  },
  {
    key: 'statuses',
    type: 'multiselect',
    label: 'Filter by statuses (multiple)',
    items: [
      { value: 'PENDING', title: 'Pending' },
      { value: 'IN_PROGRESS', title: 'In Progress' },
      { value: 'COMPLETED', title: 'Completed' },
    ],
    defaultValue: [],
  },
];

const handleEdit = (task: ITask): void => {
  navigateTo(`/tasks/${task.id}`);
};

const handleDelete = (task: ITask): void => {
  taskToDelete.value = task;
  deleteDialog.value = true;
};

const confirmDelete = async (): Promise<void> => {
  if (taskToDelete.value) {
    await deleteMutation.mutateAsync(taskToDelete.value.id);
    deleteDialog.value = false;
    taskToDelete.value = null;
  }
};
</script>
