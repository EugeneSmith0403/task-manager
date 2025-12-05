import type { Meta, StoryObj } from '@storybook/vue3';
import TextInput from './TextInput.vue';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { h } from 'vue';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    required: { control: 'boolean' },
  },
  decorators: [
    (story) => {
      return {
        components: { story },
        setup() {
          const schema = z.object({
            title: z.string().min(1, 'This field is required'),
          });
          const { handleSubmit } = useForm({
            validationSchema: toTypedSchema(schema),
            initialValues: { title: '' },
          });
          return () => h('form', { onSubmit: handleSubmit(() => {}) }, [h(story)]);
        },
      };
    },
  ],
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    name: 'title',
    label: 'Task Title',
  },
};

export const WithValue: Story = {
  args: {
    name: 'title',
    label: 'Task Title',
  },
  decorators: [
    (story) => {
      return {
        components: { story },
        setup() {
          const schema = z.object({
            title: z.string().min(1, 'This field is required'),
          });
          const { handleSubmit } = useForm({
            validationSchema: toTypedSchema(schema),
            initialValues: { title: 'Complete project documentation' },
          });
          return () => h('form', { onSubmit: handleSubmit(() => {}) }, [h(story)]);
        },
      };
    },
  ],
};

export const WithError: Story = {
  args: {
    name: 'title',
    label: 'Task Title',
  },
  decorators: [
    (story) => {
      return {
        components: { story },
        setup() {
          const schema = z.object({
            title: z.string().min(1, 'This field is required'),
          });
          const { handleSubmit, setFieldError } = useForm({
            validationSchema: toTypedSchema(schema),
            initialValues: { title: '' },
          });
          setFieldError('title', 'This field is required');
          return () => h('form', { onSubmit: handleSubmit(() => {}) }, [h(story)]);
        },
      };
    },
  ],
};

export const Required: Story = {
  args: {
    name: 'title',
    label: 'Task Title',
    required: true,
  },
};
