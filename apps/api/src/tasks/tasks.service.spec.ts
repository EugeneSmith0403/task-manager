import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../shared/redis/redis.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@repo/types';

describe('TasksService', () => {
  let service: TasksService;

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    delPattern: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task and invalidate cache', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        dueDate: '2024-12-31T00:00:00.000Z',
      };

      const expectedTask = {
        id: '1',
        ...createTaskDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.task.create.mockResolvedValue(expectedTask);
      mockRedisService.delPattern.mockResolvedValue(undefined);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(expectedTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: createTaskDto,
      });
      expect(mockRedisService.delPattern).toHaveBeenCalledWith('tasks:*');
    });
  });

  describe('findAll', () => {
    it('should return tasks from cache if available', async () => {
      const cachedTasks = [
        {
          id: '1',
          title: 'Cached Task',
          status: TaskStatus.PENDING,
          dueDate: new Date(),
        },
      ];

      mockRedisService.get.mockResolvedValue(cachedTasks);

      const result = await service.findAll({ status: [TaskStatus.PENDING] });

      expect(result).toEqual(cachedTasks);
      expect(mockRedisService.get).toHaveBeenCalledWith('tasks:status:PENDING');
      expect(mockPrismaService.task.findMany).not.toHaveBeenCalled();
    });

    it('should fetch from database and cache if not in cache', async () => {
      const tasks = [
        {
          id: '1',
          title: 'Task 1',
          status: TaskStatus.PENDING,
          dueDate: new Date(),
        },
      ];

      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.task.findMany.mockResolvedValue(tasks);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.findAll({ status: [TaskStatus.PENDING] });

      expect(result).toEqual(tasks);
      expect(mockPrismaService.task.findMany).toHaveBeenCalled();
      expect(mockRedisService.set).toHaveBeenCalledWith('tasks:status:PENDING', tasks, 300);
    });

    it('should return all tasks when no status filter', async () => {
      const tasks = [{ id: '1', title: 'Task 1', dueDate: new Date() }];

      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.task.findMany.mockResolvedValue(tasks);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.findAll({});

      expect(result).toEqual(tasks);
      expect(mockRedisService.get).toHaveBeenCalledWith('tasks:all');
    });
  });

  describe('update', () => {
    it('should update a task and invalidate cache', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      const updatedTask = {
        id: '1',
        title: 'Updated Task',
        status: TaskStatus.PENDING,
        dueDate: new Date(),
      };

      mockPrismaService.task.update.mockResolvedValue(updatedTask);
      mockRedisService.delPattern.mockResolvedValue(undefined);

      const result = await service.update('1', updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateTaskDto,
      });
      expect(mockRedisService.delPattern).toHaveBeenCalledWith('tasks:*');
    });
  });

  describe('remove', () => {
    it('should delete a task and invalidate cache', async () => {
      const deletedTask = {
        id: '1',
        title: 'Deleted Task',
        status: TaskStatus.PENDING,
        dueDate: new Date(),
      };

      mockPrismaService.task.delete.mockResolvedValue(deletedTask);
      mockRedisService.delPattern.mockResolvedValue(undefined);

      const result = await service.remove('1');

      expect(result).toEqual(deletedTask);
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockRedisService.delPattern).toHaveBeenCalledWith('tasks:*');
    });
  });
});

