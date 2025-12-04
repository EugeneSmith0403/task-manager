import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../shared/redis/redis.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly CACHE_TTL = 300;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: createTaskDto,
    });

    await this.invalidateCache();

    return task;
  }

  async findAll(query: TaskQueryDto) {
    const { status, sortBy = 'dueDate' } = query;

    if (status) {
      const cacheKey = `tasks:status:${status}`;
      const cached = await this.redis.get(cacheKey);

      if (cached) {
        return cached;
      }

      const where = { status };
      const orderBy = { [sortBy]: 'asc' as const };

      const tasks = await this.prisma.task.findMany({
        where,
        orderBy,
      });

      await this.redis.set(cacheKey, tasks, this.CACHE_TTL);

      return tasks;
    }

    const cacheKey = 'tasks:all';
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return cached;
    }

    const orderBy = { [sortBy]: 'asc' as const };

    const tasks = await this.prisma.task.findMany({
      orderBy,
    });

    await this.redis.set(cacheKey, tasks, this.CACHE_TTL);

    return tasks;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });

    await this.invalidateCache();

    return task;
  }

  async remove(id: string) {
    const task = await this.prisma.task.delete({
      where: { id },
    });

    await this.invalidateCache();

    return task;
  }

  private async invalidateCache(): Promise<void> {
    await this.redis.delPattern('tasks:*');
  }
}

