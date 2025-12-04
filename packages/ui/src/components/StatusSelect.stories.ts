import type { Meta, StoryObj } from '@storybook/vue3';
import StatusSelect from './StatusSelect.vue';

const meta: Meta<typeof StatusSelect> = {
  title: 'Components/StatusSelect',
  component: StatusSelect,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatusSelect>;

export const Default: Story = {
  args: {
    label: 'Status',
    modelValue: 'PENDING',
  },
};

export const WithError: Story = {
  args: {
    label: 'Status',
    modelValue: undefined,
    errorMessage: 'Please select a status',
  },
};
