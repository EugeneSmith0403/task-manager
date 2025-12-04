import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/shared/redis/redis.service';
import { TaskStatus } from '@prisma/client';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let redisService: RedisService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    redisService = moduleFixture.get<RedisService>(RedisService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prismaService.task.deleteMany({});
    await redisService.delPattern('tasks:*');
  });

  describe('/tasks (POST)', () => {
    it('should create a task', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          status: TaskStatus.PENDING,
          dueDate: '2024-12-31T00:00:00.000Z',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Task');
          expect(res.body.status).toBe(TaskStatus.PENDING);
        });
    });

    it('should fail validation if title is missing', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          description: 'Test Description',
          dueDate: '2024-12-31T00:00:00.000Z',
        })
        .expect(400);
    });
  });

  describe('/tasks (GET)', () => {
    it('should return empty array when no tasks', () => {
      return request(app.getHttpServer()).get('/tasks').expect(200).expect([]);
    });

    it('should return tasks', async () => {
      await prismaService.task.create({
        data: {
          title: 'Test Task',
          status: TaskStatus.PENDING,
          dueDate: new Date('2024-12-31'),
        },
      });

      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should filter tasks by status', async () => {
      await prismaService.task.createMany({
        data: [
          {
            title: 'Pending Task',
            status: TaskStatus.PENDING,
            dueDate: new Date('2024-12-31'),
          },
          {
            title: 'Completed Task',
            status: TaskStatus.COMPLETED,
            dueDate: new Date('2024-12-31'),
          },
        ],
      });

      return request(app.getHttpServer())
        .get('/tasks')
        .query({ status: TaskStatus.PENDING })
        .expect(200)
        .expect((res) => {
          expect(res.body.every((task) => task.status === TaskStatus.PENDING)).toBe(true);
        });
    });
  });

  describe('/tasks/:id (PATCH)', () => {
    it('should update a task', async () => {
      const task = await prismaService.task.create({
        data: {
          title: 'Original Title',
          status: TaskStatus.PENDING,
          dueDate: new Date('2024-12-31'),
        },
      });

      return request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .send({
          title: 'Updated Title',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Updated Title');
        });
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('should delete a task', async () => {
      const task = await prismaService.task.create({
        data: {
          title: 'Task to Delete',
          status: TaskStatus.PENDING,
          dueDate: new Date('2024-12-31'),
        },
      });

      return request(app.getHttpServer())
        .delete(`/tasks/${task.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(task.id);
        });
    });
  });
});

