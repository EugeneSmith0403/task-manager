import type { Meta, StoryObj } from '@storybook/vue3';
import TasksTable from './TasksTable.vue';

const meta: Meta<typeof TasksTable> = {
  title: 'Components/TasksTable',
  component: TasksTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TasksTable>;

const mockTasks = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the Task Manager API',
    status: 'IN_PROGRESS' as const,
    dueDate: '2024-12-31',
  },
  {
    id: '2',
    title: 'Review code changes',
    description: 'Review and approve pull requests',
    status: 'PENDING' as const,
    dueDate: '2024-12-25',
  },
  {
    id: '3',
    title: 'Deploy to production',
    description: 'Deploy the application to production environment',
    status: 'COMPLETED' as const,
    dueDate: '2024-12-20',
  },
];

export const Default: Story = {
  args: {
    tasks: mockTasks,
  },
};

export const WithFilter: Story = {
  args: {
    tasks: mockTasks,
    showFilter: true,
  },
};
