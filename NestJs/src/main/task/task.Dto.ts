import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TaskAssigneeDto {
  @IsNumberString()
  readonly userId!: string;
}

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  readonly title!: string;

  @IsInt()
  readonly position: number;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsNumberString()
  readonly cycleId?: string | null;

  @IsNumberString()
  readonly boardId!: string;

  @IsOptional()
  @IsDateString()
  readonly dueDate?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskAssigneeDto)
  readonly assigneeds: TaskAssigneeDto[];
}
