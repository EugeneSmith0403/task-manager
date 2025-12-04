<template>
  <div>
    <div v-if="showFilter" class="mb-4">
      <v-select
        v-model="selectedStatus"
        :items="statusFilterItems"
        :label="filterLabel"
        @update:model-value="handleFilterChange"
        clearable
      />
    </div>
    <v-table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" @click="handleSort(column.key)">
            {{ column.label }}
            <span v-if="sortBy === column.key">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th>{{ actionsLabel }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in sortedTasks" :key="task.id">
          <td>{{ task.title }}</td>
          <td>{{ truncateDescription(task.description) }}</td>
          <td>{{ formatStatus(task.status) }}</td>
          <td>{{ formatDate(task.dueDate) }}</td>
          <td>
            <button @click="handleEdit(task)" class="mr-2">{{ editLabel }}</button>
            <button @click="handleDelete(task)">{{ deleteLabel }}</button>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

export interface ITask {
  id: string;
  title: string;
  description?: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string | Date;
}

const props = withDefaults(
  defineProps<{
    tasks: ITask[];
    showFilter?: boolean;
    filterLabel?: string;
    actionsLabel?: string;
    editLabel?: string;
    deleteLabel?: string;
    columns?: Array<{ key: string; label: string }>;
  }>(),
  {
    showFilter: true,
    filterLabel: 'Filter by status',
    actionsLabel: 'Actions',
    editLabel: 'Edit',
    deleteLabel: 'Delete',
    columns: () => [
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description' },
      { key: 'status', label: 'Status' },
      { key: 'dueDate', label: 'Due Date' },
    ],
  },
);

const emit = defineEmits<{
  edit: [task: ITask];
  delete: [task: ITask];
  filterChange: [status: string | null];
  sortChange: [sortBy: string, sortOrder: 'asc' | 'desc'];
}>();

const selectedStatus = ref<string | null>(null);
const sortBy = ref<string>('dueDate');
const sortOrder = ref<'asc' | 'desc'>('asc');

const statusFilterItems = [
  { value: null, title: 'All' },
  { value: 'PENDING', title: 'Pending' },
  { value: 'IN_PROGRESS', title: 'In Progress' },
  { value: 'COMPLETED', title: 'Completed' },
];

const filteredTasks = computed(() => {
  if (!selectedStatus.value) return props.tasks;
  return props.tasks.filter((task) => task.status === selectedStatus.value);
});

const sortedTasks = computed(() => {
  const tasks = [...filteredTasks.value];
  return tasks.sort((a, b) => {
    const aValue = a[sortBy.value as keyof ITask];
    const bValue = b[sortBy.value as keyof ITask];

    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const handleFilterChange = (status: string | null): void => {
  emit('filterChange', status);
};

const handleSort = (columnKey: string): void => {
  if (sortBy.value === columnKey) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = columnKey;
    sortOrder.value = 'asc';
  }
  emit('sortChange', sortBy.value, sortOrder.value);
};

const handleEdit = (task: ITask): void => {
  emit('edit', task);
};

const handleDelete = (task: ITask): void => {
  emit('delete', task);
};

const truncateDescription = (description?: string | null): string => {
  if (!description) return '';
  return description.length > 50 ? `${description.substring(0, 50)}...` : description;
};

const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
  };
  return statusMap[status] || status;
};

const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
};
</script>

