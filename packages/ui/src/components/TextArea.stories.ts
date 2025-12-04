import type { Meta, StoryObj } from '@storybook/vue3';
import TextArea from './TextArea.vue';

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {
    label: 'Description',
    modelValue: '',
  },
};

export const WithError: Story = {
  args: {
    label: 'Description',
    modelValue: '',
    errorMessage: 'Invalid description',
  },
};
