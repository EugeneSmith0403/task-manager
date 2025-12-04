<template>
  <v-select
    :model-value="modelValue"
    @update:model-value="handleChange"
    :items="statusItems"
    :label="label"
    :error-messages="errorMessage ? [errorMessage] : []"
    :required="required"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { useId } from 'vue';

export type TStatusValue = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

const props = withDefaults(
  defineProps<{
    modelValue?: TStatusValue;
    name?: string;
    label?: string;
    errorMessage?: string;
    required?: boolean;
    statuses?: Array<{ value: TStatusValue; title: string }>;
  }>(),
  {
    modelValue: undefined,
    name: undefined,
    label: 'Status',
    errorMessage: undefined,
    required: false,
    statuses: () => [
      { value: 'PENDING', title: 'Pending' },
      { value: 'IN_PROGRESS', title: 'In Progress' },
      { value: 'COMPLETED', title: 'Completed' },
    ],
  },
);

const randomName = useId();

const { handleChange } = useField<TStatusValue>(() => props.name ?? randomName, undefined, {
  syncVModel: props.name ? undefined : 'modelValue',
  validateOnValueUpdate: false,
});

const statusItems = computed(() => props.statuses);
</script>

