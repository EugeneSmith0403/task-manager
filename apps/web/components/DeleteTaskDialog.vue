<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="handleDialogUpdate"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ $t('tasks.deleteConfirmTitle') }}
      </v-card-title>
      <v-card-text>
        {{ deleteConfirmMessage }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          @click="handleCancel"
          color="secondary"
          variant="text"
          :disabled="loading"
        >
          {{ $t('tasks.cancel') }}
        </v-btn>
        <v-btn
          @click="handleConfirm"
          color="error"
          :loading="loading"
        >
          {{ $t('tasks.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ITask } from '~/composables/useTasks';

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    task: ITask | null;
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
}>();

const deleteConfirmMessage = computed(() => {
  if (!props.task) return '';
  return t('tasks.deleteConfirmMessage', { title: props.task.title });
});

const handleDialogUpdate = (value: boolean): void => {
  emit('update:modelValue', value);
};

const handleCancel = (): void => {
  emit('update:modelValue', false);
};

const handleConfirm = (): void => {
  emit('confirm');
};
</script>

