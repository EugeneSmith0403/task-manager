<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="handleChange"
    :label="label"
    :error-messages="errorMessage ? [errorMessage] : []"
    :required="required"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { useId } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    name?: string;
    label?: string;
    errorMessage?: string;
    required?: boolean;
  }>(),
  {
    modelValue: undefined,
    name: undefined,
    label: '',
    errorMessage: undefined,
    required: false,
  },
);

const randomName = useId();

const { handleChange } = useField<string>(() => props.name ?? randomName, undefined, {
  syncVModel: props.name ? undefined : 'modelValue',
  validateOnValueUpdate: false,
});
</script>

