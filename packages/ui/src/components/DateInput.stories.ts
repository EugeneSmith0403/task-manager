import type { Meta, StoryObj } from '@storybook/vue3';
import DateInput from './DateInput.vue';

const meta: Meta<typeof DateInput> = {
  title: 'Components/DateInput',
  component: DateInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DateInput>;

export const Default: Story = {
  args: {
    label: 'Due Date',
    modelValue: '',
  },
};

export const WithError: Story = {
  args: {
    label: 'Due Date',
    modelValue: '',
    errorMessage: 'Please select a valid date',
  },
};
