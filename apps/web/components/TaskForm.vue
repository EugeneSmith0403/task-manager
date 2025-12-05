<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-4">
      <TextInput
        name="title"
        :label="$t('form.title')"
      />
      <TextArea
        name="description"
        :label="$t('form.description')"
      />
      <StatusSelect
        name="status"
        :label="$t('form.status')"
      />
      <DateInput
        name="dueDate"
        :label="$t('form.dueDate')"
      />
      <div class="flex gap-4 pt-4">
        <v-btn
          type="submit"
          color="primary"
          size="large"
        >
          {{ $t('form.save') }}
        </v-btn>
        <v-btn
          type="button"
          @click="handleCancel"
          color="secondary"
          variant="outlined"
          size="large"
        >
          {{ $t('form.cancel') }}
        </v-btn>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { TextInput, TextArea, StatusSelect, DateInput } from '@task-manager/ui';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    initialData?: {
      id?: string;
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

// Создаем схему валидации с использованием i18n
const createSchema = () => {
  // Валидация даты: проверяем формат YYYY-MM-DD и преобразуем в ISO-8601 DateTime
  const dateValidation = z
    .string()
    .min(1, t('form.errors.dateRequired'))
    .refine(
      (val) => {
        // Проверяем формат YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(val)) {
          return false;
        }
        // Проверяем, что это валидная дата
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: t('form.errors.dateInvalid'),
      },
    );

  return z.object({
    title: z.string().min(1, t('form.errors.titleRequired')),
    description: z.preprocess((val) => (val === null ? undefined : val), z.string().optional()),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
    dueDate: dateValidation,
  });
};

const schema = createSchema();

// Преобразуем дату из формата YYYY-MM-DD в ISO-8601 DateTime (начало дня)
const formatDateForApi = (dateString: string): string => {
  if (!dateString) return dateString;
  // Если дата уже в формате ISO-8601 DateTime, возвращаем как есть
  if (dateString.includes('T')) {
    return dateString;
  }
  // Преобразуем YYYY-MM-DD в ISO-8601 DateTime (начало дня в UTC)
  return new Date(`${dateString}T00:00:00.000Z`).toISOString();
};

// Преобразуем дату из ISO-8601 DateTime в формат YYYY-MM-DD для input[type="date"]
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  // Если дата уже в формате YYYY-MM-DD, возвращаем как есть
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  // Преобразуем ISO-8601 DateTime в YYYY-MM-DD
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

type FormValues = {
  title: string;
  description?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;
};

const getInitialValues = (): FormValues => {
  if (props.initialData) {
    const description = props.initialData.description === null || props.initialData.description === undefined
      ? undefined
      : props.initialData.description;
    return {
      title: props.initialData.title,
      description,
      status: props.initialData.status,
      dueDate: formatDateForInput(props.initialData.dueDate),
    } as FormValues;
  }
  return {
    title: '',
    description: '',
    status: 'PENDING' as const,
    dueDate: '',
  };
};

const { handleSubmit: handleFormSubmit } = useForm<FormValues>({
  validationSchema: toTypedSchema(schema),
  initialValues: getInitialValues(),
});

const onSubmit = handleFormSubmit((values) => {
  // Преобразуем дату в ISO-8601 DateTime перед отправкой
  const submitData = {
    ...values,
    dueDate: formatDateForApi(values.dueDate),
  };
  emit('submit', submitData);
});

const handleSubmit = (): void => {
  onSubmit();
};

const handleCancel = (): void => {
  emit('cancel');
};
</script>
