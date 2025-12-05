<template>
  <v-text-field
    :model-value="value"
    @update:model-value="handleChange"
    @blur="handleBlur"
    :label="label"
    :error-messages="errorMessage ? [errorMessage] : []"
    type="date"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

const props = withDefaults(
  defineProps<{
    name: string;
    label?: string;
    required?: boolean;
  }>(),
  {
    label: 'Due Date',
    required: false,
  },
);

const { errorMessage, handleBlur, handleChange, value } = useField(() => props.name, undefined, {
  validateOnValueUpdate: false,
});
</script>

