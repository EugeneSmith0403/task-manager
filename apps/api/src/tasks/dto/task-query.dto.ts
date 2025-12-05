import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsArray,
  IsDateString,
  IsInt,
  Min,
  Max,
  ArrayMinSize,
  IsIn,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { TaskStatus } from '@repo/types';

export class TaskQueryDto {
  @ApiPropertyOptional({ description: 'Filter by title (partial match)' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by status (can specify multiple values)',
    enum: TaskStatus,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string') {
      return value.split(',').map((s: string) => s.trim());
    }
    return [value];
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(TaskStatus, { each: true })
  status?: TaskStatus[];

  @ApiPropertyOptional({ description: 'Filter by due date from (ISO date string)' })
  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @ApiPropertyOptional({ description: 'Filter by due date to (ISO date string)' })
  @IsOptional()
  @IsDateString()
  dueDateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by creation date from (ISO date string)' })
  @IsOptional()
  @IsDateString()
  createdAtFrom?: string;

  @ApiPropertyOptional({ description: 'Filter by creation date to (ISO date string)' })
  @IsOptional()
  @IsDateString()
  createdAtTo?: string;

  @ApiPropertyOptional({ description: 'Filter by update date from (ISO date string)' })
  @IsOptional()
  @IsDateString()
  updatedAtFrom?: string;

  @ApiPropertyOptional({ description: 'Filter by update date to (ISO date string)' })
  @IsOptional()
  @IsDateString()
  updatedAtTo?: string;

  @ApiPropertyOptional({ 
    default: 'dueDate', 
    description: 'Sort by field (id, title, status, dueDate, createdAt, updatedAt)', 
    enum: ['id', 'title', 'status', 'dueDate', 'createdAt', 'updatedAt'] 
  })
  @IsOptional()
  @IsIn(['id', 'title', 'status', 'dueDate', 'createdAt', 'updatedAt'])
  sortBy?: 'id' | 'title' | 'status' | 'dueDate' | 'createdAt' | 'updatedAt';

  @ApiPropertyOptional({ default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
