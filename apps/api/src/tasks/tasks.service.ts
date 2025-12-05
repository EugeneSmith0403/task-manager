import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../shared/redis/redis.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { Task } from '@repo/types';

@Injectable()
export class TasksService {
  private readonly CACHE_TTL = 300;
  private readonly CACHE_KEY_ALL = 'tasks:all';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private hasFilters(query: TaskQueryDto): boolean {
    return !!(
      query.title ||
      (query.status && query.status.length > 0) ||
      query.dueDateFrom ||
      query.dueDateTo ||
      query.createdAtFrom ||
      query.createdAtTo ||
      query.updatedAtFrom ||
      query.updatedAtTo
    );
  }

  private isDateInRange(
    date: Date | string,
    from?: string,
    to?: string,
  ): boolean {
    if (!from && !to) return true;
    const dateTime = new Date(date).getTime();
    if (from && dateTime < new Date(from).getTime()) return false;
    if (to && dateTime > new Date(to).getTime()) return false;
    return true;
  }

  private applyFiltersInMemory(tasks: Task[], query: TaskQueryDto): Task[] {
    return tasks.filter((task) => {
      if (query.title) {
        const titleLower = query.title.toLowerCase();
        if (!task.title.toLowerCase().includes(titleLower)) return false;
      }

      if (query.status && query.status.length > 0) {
        if (!query.status.includes(task.status)) return false;
      }

      if (!this.isDateInRange(task.dueDate, query.dueDateFrom, query.dueDateTo)) {
        return false;
      }

      if (!this.isDateInRange(task.createdAt, query.createdAtFrom, query.createdAtTo)) {
        return false;
      }

      if (!this.isDateInRange(task.updatedAt, query.updatedAtFrom, query.updatedAtTo)) {
        return false;
      }

      return true;
    });
  }

  private applySorting(tasks: Task[], sortBy: string): Task[] {
    const sorted = [...tasks];
    const sortField = sortBy as keyof Task;

    sorted.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue instanceof Date && bValue instanceof Date) {
        return aValue.getTime() - bValue.getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }

      return String(aValue).localeCompare(String(bValue));
    });

    return sorted;
  }

  private applyPagination<T>(
    items: T[],
    page: number,
    limit: number,
  ): { data: T[]; total: number; page: number; limit: number; totalPages: number } {
    const total = items.length;
    const skip = (page - 1) * limit;
    const data = items.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: createTaskDto,
    });

    await this.updateCacheAfterCreate(task);

    return task;
  }

  private buildPrismaWhere(query: TaskQueryDto): any {
    const where: any = {};

    if (query.title) {
      where.title = {
        contains: query.title,
        mode: 'insensitive',
      };
    }

    if (query.status && query.status.length > 0) {
      where.status = { in: query.status };
    }

    if (query.dueDateFrom || query.dueDateTo) {
      where.dueDate = {};
      if (query.dueDateFrom) where.dueDate.gte = new Date(query.dueDateFrom);
      if (query.dueDateTo) where.dueDate.lte = new Date(query.dueDateTo);
    }

    if (query.createdAtFrom || query.createdAtTo) {
      where.createdAt = {};
      if (query.createdAtFrom) where.createdAt.gte = new Date(query.createdAtFrom);
      if (query.createdAtTo) where.createdAt.lte = new Date(query.createdAtTo);
    }

    if (query.updatedAtFrom || query.updatedAtTo) {
      where.updatedAt = {};
      if (query.updatedAtFrom) where.updatedAt.gte = new Date(query.updatedAtFrom);
      if (query.updatedAtTo) where.updatedAt.lte = new Date(query.updatedAtTo);
    }

    return where;
  }

  private async getAllTasksFromCacheOrDb(): Promise<Task[]> {
    const cachedTasks = await this.redis.get<Task[]>(this.CACHE_KEY_ALL);
    if (cachedTasks) return cachedTasks;

    const allTasks = await this.prisma.task.findMany();
    await this.redis.set(this.CACHE_KEY_ALL, allTasks, this.CACHE_TTL);
    return allTasks;
  }

  private async findAllWithoutFilters(
    sortBy: string,
    page: number,
    limit: number,
  ) {
    const tasks = await this.getAllTasksFromCacheOrDb();
    const sorted = this.applySorting(tasks, sortBy);
    return this.applyPagination(sorted, page, limit);
  }

  private async findAllWithFilters(
    query: TaskQueryDto,
    sortBy: string,
    page: number,
    limit: number,
  ) {
    const cachedTasks = await this.redis.get<Task[]>(this.CACHE_KEY_ALL);

    if (cachedTasks) {
      const filtered = this.applyFiltersInMemory(cachedTasks, query);
      const sorted = this.applySorting(filtered, sortBy);
      return this.applyPagination(sorted, page, limit);
    }

    const where = this.buildPrismaWhere(query);
    const orderBy = { [sortBy]: 'asc' as const };
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAll(query: TaskQueryDto) {
    const {
      sortBy = 'dueDate',
      page = 1,
      limit = 20,
    } = query;

    return this.hasFilters(query)
      ? this.findAllWithFilters(query, sortBy, page, limit)
      : this.findAllWithoutFilters(sortBy, page, limit);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });

    await this.updateCacheAfterUpdate(task);

    return task;
  }

  async remove(id: string) {
    const task = await this.prisma.task.delete({
      where: { id },
    });

    await this.updateCacheAfterDelete(id);

    return task;
  }

  private async updateCacheAfterCreate(task: Task): Promise<void> {
    const cachedTasks = await this.redis.get<Task[]>(this.CACHE_KEY_ALL);
    
    if (cachedTasks) {
      cachedTasks.push(task);
      await this.redis.set(this.CACHE_KEY_ALL, cachedTasks, this.CACHE_TTL);
    }
  }

  private async updateCacheAfterUpdate(updatedTask: Task): Promise<void> {
    const cachedTasks = await this.redis.get<Task[]>(this.CACHE_KEY_ALL);
    
    if (cachedTasks) {
      const index = cachedTasks.findIndex((task) => task.id === updatedTask.id);
      if (index !== -1) {
        cachedTasks[index] = updatedTask;
        await this.redis.set(this.CACHE_KEY_ALL, cachedTasks, this.CACHE_TTL);
      }
    }
  }

  private async updateCacheAfterDelete(taskId: string): Promise<void> {
    const cachedTasks = await this.redis.get<Task[]>(this.CACHE_KEY_ALL);
    
    if (cachedTasks) {
      const filtered = cachedTasks.filter((task) => task.id !== taskId);
      await this.redis.set(this.CACHE_KEY_ALL, filtered, this.CACHE_TTL);
    }
  }
}
