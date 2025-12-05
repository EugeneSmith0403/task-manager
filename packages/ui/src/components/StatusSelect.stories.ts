import type { Meta, StoryObj } from '@storybook/vue3';
import StatusSelect from './StatusSelect.vue';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { h } from 'vue';

const meta: Meta<typeof StatusSelect> = {
  title: 'Components/StatusSelect',
  component: StatusSelect,
  tags: ['autodocs'],
  decorators: [
    (story) => {
      return {
        components: { story },
        setup() {
          const schema = z.object({
            status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
          });
          const { handleSubmit } = useForm({
            validationSchema: toTypedSchema(schema),
            initialValues: { status: 'PENDING' },
          });
          return () => h('form', { onSubmit: handleSubmit(() => {}) }, [h(story)]);
        },
      };
    },
  ],
};

export default meta;
type Story = StoryObj<typeof StatusSelect>;

export const Default: Story = {
  args: {
    name: 'status',
    label: 'Status',
  },
};

export const WithError: Story = {
  args: {
    name: 'status',
    label: 'Status',
  },
  decorators: [
    (story) => {
      return {
        components: { story },
        setup() {
          const schema = z.object({
            status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
              errorMap: () => ({ message: 'Please select a status' }),
            }),
          });
          const { handleSubmit, setFieldError } = useForm({
            validationSchema: toTypedSchema(schema),
            initialValues: { status: undefined },
          });
          setFieldError('status', 'Please select a status');
          return () => h('form', { onSubmit: handleSubmit(() => {}) }, [h(story)]);
        },
      };
    },
  ],
};
