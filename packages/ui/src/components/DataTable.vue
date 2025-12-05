<template>
  <div>
    <v-table style="table-layout: fixed; width: 100%;">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="{ 'cursor-pointer': column.sortable !== false }"
            :style="column.width ? { width: column.width, minWidth: column.width, maxWidth: column.width } : {}"
            @click="column.sortable !== false && handleSort(column.key)"
          >
            {{ column.label }}
            <span v-if="sortBy === column.key">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th
            v-if="hasActionsSlot"
            :style="actionsWidth ? { width: actionsWidth, minWidth: actionsWidth, maxWidth: actionsWidth } : {}"
          >
            {{ actionsLabel }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="sortedItems.length === 0">
          <td :colspan="columns.length + (hasActionsSlot ? 1 : 0)" class="text-center py-8 text-gray-500">
            {{ emptyMessage }}
          </td>
        </tr>
        <tr v-for="item in sortedItems" :key="getItemId(item)">
          <td
            v-for="column in columns"
            :key="column.key"
            :style="column.width ? { width: column.width, minWidth: column.width, maxWidth: column.width } : {}"
          >
            <slot
              :name="`cell-${column.key}`"
              :item="item"
              :value="getColumnValue(item, column.key)"
              :formatted="formatColumnValue(item, column)"
            >
              {{ formatColumnValue(item, column) }}
            </slot>
          </td>
          <td
            v-if="hasActionsSlot"
            :style="actionsWidth ? { width: actionsWidth, minWidth: actionsWidth, maxWidth: actionsWidth } : {}"
          >
            <slot name="actions" :item="item" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue';

export interface ColumnConfig<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  formatter?: (value: any, item: T) => string;
  width?: string;
}

const props = withDefaults(
  defineProps<{
    items: any[];
    columns: ColumnConfig[];
    actionsLabel?: string;
    actionsWidth?: string;
    emptyMessage?: string;
    getId?: (item: any) => string | number;
  }>(),
  {
    actionsLabel: 'Actions',
    emptyMessage: 'No data available',
    getId: (item: any) => item.id,
  },
);

const emit = defineEmits<{
  sortChange: [sortBy: string, sortOrder: 'asc' | 'desc'];
}>();

const slots = useSlots();
const hasActionsSlot = computed(() => !!slots.actions);

const sortBy = ref<string>('');
const sortOrder = ref<'asc' | 'desc'>('asc');

const sortedItems = computed(() => {
  const items = [...props.items];
  
  if (!sortBy.value) return items;
  
  const column = props.columns.find((col) => col.key === sortBy.value);
  if (!column || column.sortable === false) return items;

  return items.sort((a, b) => {
    const aValue = getColumnValue(a, sortBy.value);
    const bValue = getColumnValue(b, sortBy.value);

    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const getItemId = (item: any): string | number => {
  return props.getId(item);
};

const getColumnValue = (item: any, key: string): any => {
  return item[key];
};

const formatColumnValue = (item: any, column: ColumnConfig): string => {
  const value = getColumnValue(item, column.key);
  
  if (column.formatter) {
    return column.formatter(value, item);
  }
  
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  return String(value);
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
</script>

