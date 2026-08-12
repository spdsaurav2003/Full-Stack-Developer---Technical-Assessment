import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  MaxLength,
} from 'class-validator';

export enum TaskStatus {
  TODO = 'TODO',
  DOING = 'DOING',
  COMPLETED = 'COMPLETED',
  BACKLOG = 'BACKLOG',
}

export enum Priority {
  NO_PRIORITY = 'NO_PRIORITY',
  URGENT = 'URGENT',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export class CreateTaskDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  assigneeId?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  labelIds?: string[];
}
