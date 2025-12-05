import { PrismaClient, TaskStatus } from '@repo/types';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Seeding database...');

  await prisma.task.createMany({
    data: [
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the Task Manager API',
        status: TaskStatus.IN_PROGRESS,
        dueDate: new Date('2024-12-31'),
      },
      {
        title: 'Review code changes',
        description: 'Review and approve pull requests',
        status: TaskStatus.PENDING,
        dueDate: new Date('2024-12-25'),
      },
      {
        title: 'Deploy to production',
        description: 'Deploy the application to production environment',
        status: TaskStatus.COMPLETED,
        dueDate: new Date('2024-12-20'),
      },
    ],
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

