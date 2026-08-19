import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { TaskPriority } from '@prisma/client'

export class CreateTaskDto {
    @IsString()
    @MinLength(2)
    @MaxLength(200)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(5000)
    description?: string;

    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @IsOptional()
    @IsUUID()
    assigneeId?: string;

    @IsOptional()
    @IsDateString()
    dueAt?: string;
}