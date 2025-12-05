import type { Meta, StoryObj } from '@storybook/vue3';
import TextArea from './TextArea.vue';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { h } from 'vue';

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  decorators: [
    (story) => {
      return {
        components: { story },
        setup() {
          const schema = z.object({
            description: z.string().optional(),
          });
          const { handleSubmit } = useForm({
            validationSchema: toTypedSchema(schema),
            initialValues: { description: '' },
          });
          return () => h('form', { onSubmit: handleSubmit(() => {}) }, [h(story)]);
        },
      };
    },
  ],
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {
    name: 'description',
    label: 'Description',
  },
};

export const WithError: Story = {
  args: {
    name: 'description',
    label: 'Description',
  },
  decorators: [
    (story) => {
      return {
        components: { story },
        setup() {
          const schema = z.object({
            description: z.string().min(10, 'Invalid description'),
          });
          const { handleSubmit, setFieldError } = useForm({
            validationSchema: toTypedSchema(schema),
            initialValues: { description: '' },
          });
          setFieldError('description', 'Invalid description');
          return () => h('form', { onSubmit: handleSubmit(() => {}) }, [h(story)]);
        },
      };
    },
  ],
};
