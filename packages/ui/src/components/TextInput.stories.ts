import type { Meta, StoryObj } from '@storybook/vue3';
import TextInput from './TextInput.vue';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    label: { control: 'text' },
    errorMessage: { control: 'text' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    label: 'Task Title',
    modelValue: '',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Task Title',
    modelValue: 'Complete project documentation',
  },
};

export const WithError: Story = {
  args: {
    label: 'Task Title',
    modelValue: '',
    errorMessage: 'This field is required',
  },
};

export const Required: Story = {
  args: {
    label: 'Task Title',
    modelValue: '',
    required: true,
  },
};
