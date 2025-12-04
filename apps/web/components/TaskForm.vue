<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-4">
      <TextInput
        v-model="formData.title"
        :label="$t('form.title')"
        :error-message="errors.title"
        required
      />
      <TextArea
        v-model="formData.description"
        :label="$t('form.description')"
        :error-message="errors.description"
      />
      <StatusSelect
        v-model="formData.status"
        :label="$t('form.status')"
        :error-message="errors.status"
      />
      <DateInput
        v-model="formData.dueDate"
        :label="$t('form.dueDate')"
        :error-message="errors.dueDate"
        required
      />
      <div class="flex gap-4">
        <button type="submit" class="btn-primary">{{ $t('form.save') }}</button>
        <button type="button" @click="handleCancel" class="btn-secondary">
          {{ $t('form.cancel') }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { TextInput, TextArea, StatusSelect, DateInput } from '@task-manager/ui';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

const props = withDefaults(
  defineProps<{
    initialData?: {
      title: string;
      description?: string | null;
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
      dueDate: string;
    };
  }>(),
  {
    initialData: undefined,
  },
);

const emit = defineEmits<{
  submit: [data: unknown];
  cancel: [];
}>();

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  dueDate: z.string().min(1, 'Due date is required'),
});

const { handleSubmit: handleFormSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: props.initialData || {
    title: '',
    description: '',
    status: 'PENDING',
    dueDate: '',
  },
});

const [title] = defineField('title');
const [description] = defineField('description');
const [status] = defineField('status');
const [dueDate] = defineField('dueDate');

const formData = computed(() => ({
  title: title.value,
  description: description.value,
  status: status.value,
  dueDate: dueDate.value,
}));

const onSubmit = handleFormSubmit((values) => {
  emit('submit', values);
});

const handleSubmit = (): void => {
  onSubmit();
};

const handleCancel = (): void => {
  emit('cancel');
};
</script>
