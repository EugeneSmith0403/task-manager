<template>
  <v-select
    :model-value="value"
    @update:model-value="handleChange"
    @blur="handleBlur"
    :items="statusItems"
    :label="label"
    :error-messages="errorMessage ? [errorMessage] : []"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useField } from 'vee-validate';

export type TStatusValue = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

const props = withDefaults(
  defineProps<{
    name: string;
    label?: string;
    required?: boolean;
    statuses?: Array<{ value: TStatusValue; title: string }>;
  }>(),
  {
    label: 'Status',
    required: false,
    statuses: () => [
      { value: 'PENDING', title: 'Pending' },
      { value: 'IN_PROGRESS', title: 'In Progress' },
      { value: 'COMPLETED', title: 'Completed' },
    ],
  },
);

const { errorMessage, handleBlur, handleChange, value } = useField<TStatusValue>(() => props.name, undefined, {
  validateOnValueUpdate: false,
});

const statusItems = computed(() => props.statuses);
</script>

