<template>
  <div v-if="filters.length > 0" class="filters-container mb-4">
    <div
        v-for="filter in filters"
        :key="filter.key"
        class="w-[320px]"
      >
        <v-text-field
          v-if="filter.type === 'text'"
          :model-value="filterValues[filter.key]"
          :label="filter.label"
          :placeholder="filter.placeholder"
          variant="outlined"
          size="large"
          @update:model-value="handleFilterChange(filter.key, $event)"
          @clear="handleFilterChange(filter.key, '')"
        />

        <v-select
          v-else-if="filter.type === 'select'"
          :model-value="filterValues[filter.key]"
          :items="filter.items"
          :label="filter.label"
           :placeholder="filter.placeholder"
          :item-title="filter.itemTitle || 'title'"
          :item-value="filter.itemValue || 'value'"
          class="w-[320px]"
          variant="outlined"
          size="large"
          @update:model-value="handleFilterChange(filter.key, $event)"
        />

        <v-select
          v-else-if="filter.type === 'multiselect'"
          :model-value="filterValues[filter.key]"
          :items="filter.items"
          :label="filter.label"
          :item-title="filter.itemTitle || 'title'"
          :item-value="filter.itemValue || 'value'"
          :placeholder="filter.placeholder"
          variant="outlined"
          size="large"
          multiple
          @update:model-value="handleFilterChange(filter.key, $event)"
        />
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

export type FilterType = 'text' | 'select' | 'multiselect';

export interface FilterItem {
  value: any;
  title: string;
}

export interface FilterConfig {
  key: string;
  type: FilterType;
  label: string;
  placeholder?: string;
  items?: FilterItem[];
  itemTitle?: string;
  itemValue?: string;
  minWidth?: string;
  flex?: string;
  defaultValue?: any;
}

const props = defineProps<{
  filters: FilterConfig[];
  modelValue?: Record<string, any>;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>];
  filterChange: [key: string, value: any];
  filtersChange: [filters: Record<string, any>];
}>();

const filterValues = ref<Record<string, any>>({});

onMounted(() => {
  if (props.modelValue) {
    filterValues.value = { ...props.modelValue };
  } else {
    props.filters.forEach((filter) => {
      if (filter.defaultValue !== undefined) {
        filterValues.value[filter.key] = filter.defaultValue;
      } else if (filter.type === 'multiselect') {
        filterValues.value[filter.key] = [];
      } else {
        filterValues.value[filter.key] = null;
      }
    });
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      filterValues.value = { ...newValue };
    }
  },
  { deep: true },
);

const handleFilterChange = (key: string, value: any): void => {
  filterValues.value[key] = value;
  emit('update:modelValue', { ...filterValues.value });
  emit('filterChange', key, value);
  emit('filtersChange', { ...filterValues.value });
};
</script>
