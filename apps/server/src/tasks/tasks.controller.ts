import { Body, Controller, Get, Param, Patch, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import type { JwtPayload } from "src/auth/jwt-payload.interface";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";

type AuthenticatedRequest = Request & { user: JwtPayload; };

@Controller('api/tasks')
export class TasksController {
    constructor(
        private readonly tasksService:
            TasksService,
    ) {}

    @Post()
    create(
        @Req()
        request: AuthenticatedRequest,

        @Body()
        dto: CreateTaskDto,
    ) {
        return this.tasksService.create(
            request.user.sub,
            dto,
        );
    }

    @Get()
    findAll() {
        return this.tasksService.findAll();
    }

    @Get()
    findOne(
        @Param(":id")
        id: string,
    ) {
        return this.tasksService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id')
        id: string,

        @Body()
        dto: UpdateTaskDto,
    ) {
        return this.tasksService.update(
            id,
            dto,
        );
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id')
        id: string,

        @Body()
        dto: UpdateTaskStatusDto,
    ) {
        return this.tasksService
            .updateStatus(
                id,
                dto,
            );
    }
}