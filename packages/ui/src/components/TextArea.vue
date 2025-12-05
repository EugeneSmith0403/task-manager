<template>
  <v-textarea
    :model-value="value"
    @update:model-value="handleChange"
    @blur="handleBlur"
    :label="label"
    :error-messages="errorMessage ? [errorMessage] : []"
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
    label: '',
    required: false,
  },
);

const { errorMessage, handleBlur, handleChange, value } = useField(() => props.name, undefined, {
  validateOnValueUpdate: false,
});
</script>

