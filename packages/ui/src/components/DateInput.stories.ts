import type { Meta, StoryObj } from '@storybook/vue3';
import DateInput from './DateInput.vue';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { h } from 'vue';

const meta: Meta<typeof DateInput> = {
  title: 'Components/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  decorators: [
    (story) => {
      return {
        components: { story },
        setup() {
          const schema = z.object({
            dueDate: z.string().optional(),
          });
          const { handleSubmit } = useForm({
            validationSchema: toTypedSchema(schema),
            initialValues: { dueDate: '' },
          });
          return () => h('form', { onSubmit: handleSubmit(() => {}) }, [h(story)]);
        },
      };
    },
  ],
};

export default meta;
type Story = StoryObj<typeof DateInput>;

export const Default: Story = {
  args: {
    name: 'dueDate',
    label: 'Due Date',
  },
};

export const WithError: Story = {
  args: {
    name: 'dueDate',
    label: 'Due Date',
  },
  decorators: [
    (story) => {
      return {
        components: { story },
        setup() {
          const schema = z.object({
            dueDate: z.string().min(1, 'Please select a valid date'),
          });
          const { handleSubmit, setFieldError } = useForm({
            validationSchema: toTypedSchema(schema),
            initialValues: { dueDate: '' },
          });
          setFieldError('dueDate', 'Please select a valid date');
          return () => h('form', { onSubmit: handleSubmit(() => {}) }, [h(story)]);
        },
      };
    },
  ],
};
