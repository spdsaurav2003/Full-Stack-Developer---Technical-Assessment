import { IsString, IsOptional, IsEnum, IsDateString, MaxLength } from 'class-validator';

enum Priority {
  NO_PRIORITY = 'NO_PRIORITY',
  URGENT = 'URGENT',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export class CreateSubtaskDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  assigneeId?: string;
}
