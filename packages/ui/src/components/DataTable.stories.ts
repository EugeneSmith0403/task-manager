import type { Meta, StoryObj } from '@storybook/vue3';
import DataTable from './DataTable.vue';

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

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

const columns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'description', label: 'Description', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'dueDate', label: 'Due Date', sortable: true },
];

const filterConfig = {
  label: 'Filter by status',
  items: [
    { value: null, title: 'All' },
    { value: 'PENDING', title: 'Pending' },
    { value: 'IN_PROGRESS', title: 'In Progress' },
    { value: 'COMPLETED', title: 'Completed' },
  ],
  getValue: (item: any) => item.status,
};

export const Default: Story = {
  args: {
    items: mockTasks,
    columns,
  },
};

export const WithFilter: Story = {
  args: {
    items: mockTasks,
    columns,
    showFilter: true,
    filterConfig,
  },
};

