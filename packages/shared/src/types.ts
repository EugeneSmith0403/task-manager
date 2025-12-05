// Import Prisma types and enums
import type { Task, Prisma } from '@prisma/client';
import { TaskStatus } from '@prisma/client';

// Re-export Prisma types
export type { Task, Prisma };
export { TaskStatus };

// Task DTO interfaces (for frontend and API communication)
export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

export interface TaskQueryDto {
  title?: string;
  status?: TaskStatus[];
  dueDateFrom?: string;
  dueDateTo?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
  sortBy?: 'id' | 'title' | 'status' | 'dueDate' | 'createdAt' | 'updatedAt';
  page?: number;
  limit?: number;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

