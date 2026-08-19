import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { TaskPriority } from '@prisma/client'

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(200)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(5000)
    description?: string | null;

    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @IsOptional()
    @IsUUID()
    assigneeId?: string | null;

    @IsOptional()
    @IsDateString()
    dueAt?: string | null;
}