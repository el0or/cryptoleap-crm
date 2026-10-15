import { Injectable, NotFoundException } from "@nestjs/common";
import { TaskStatus, ActivityType } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";

@Injectable()
export class TasksService {
    constructor(
        private readonly prisma:
            PrismaService,
    ) {}

    async create(userId: string, dto: CreateTaskDto) {
        if (dto.assigneeId) {
            await this.ensureUserExists(dto.assigneeId);
        }

        return this.prisma.$transaction(async (tx) => {
            const task = await tx.task.create({
                data: {
                    title: dto.title.trim(),
                    description: dto.description?.trim(),
                    priority: dto.priority,
                    dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
                    createdById: userId,
                    assigneeId: dto.assigneeId,
                },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            role: true,
                        },
                    },
                    assignee: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            role: true,
                        },
                    },
                },
            });

            await tx.activityLog.create({
                data: {
                    type: ActivityType.TASK_CREATED,
                    userId,
                    taskId: task.id,
                },
            });

            return task;
        });
    }

    async findAll() {
        return this.prisma.task.findMany({
            orderBy: {
                createdAt: 'desc',
            },

            include: {
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },

                assignee: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });
    }

    async findOne(
        taskId: string,
    ) {
        const task = await this.prisma.task.findUnique({
            where: {
                id: taskId,
            },

            include: {
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                    },
                },

                assignee: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                    },
                },
            },
        });

        if (!task) {
            throw new NotFoundException(
                'Задача не найдена'
            );
        }

        return task;
    }

    async update(userId: string, taskId: string, dto: UpdateTaskDto) {
        const currentTask = await this.getTaskOrThrow(taskId);

        if (dto.assigneeId) {
            await this.ensureUserExists(dto.assigneeId);
        }

        const assigneeChanged = dto.assigneeId !== undefined && dto.assigneeId !== currentTask.assigneeId;

        return this.prisma.$transaction(async (tx) => {
            const task = await tx.task.update({
                where: {
                    id: taskId,
                },
                data: {
                    ...(dto.title !== undefined && {
                        title: dto.title.trim(),
                    }),
                    ...(dto.description !== undefined && {
                        description: dto.description?.trim() ?? null,
                    }),
                    ...(dto.priority !== undefined && {
                        priority: dto.priority,
                    }),
                    ...(dto.assigneeId !== undefined && {
                        assigneeId: dto.assigneeId,
                    }),
                    ...(dto.dueAt !== undefined && {
                        dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
                    }),
                },
            });

            await tx.activityLog.create({
                data: {
                    type: assigneeChanged ? ActivityType.TASK_ASSIGNEE_CHANGED : ActivityType.TASK_UPDATED,
                    userId,
                    taskId,
                    metadata: assigneeChanged
                        ? {
                            fromAssigneeId: currentTask.assigneeId,
                            toAssigneeId: dto.assigneeId,
                        }
                        : undefined,
                },
            });

            return task;
        });
    }

    async updateStatus(userId: string, taskId: string, dto: UpdateTaskStatusDto) {
        const currentTask = await this.getTaskOrThrow(taskId);

        if (currentTask.status === dto.status) {
            return currentTask;
        }

        return this.prisma.$transaction(async (tx) => {
            const task = await tx.task.update({
                where: {
                    id: taskId,
                },
                data: {
                    status: dto.status,
                    completedAt: dto.status === TaskStatus.DONE ? new Date() : null,
                },
            });

            await tx.activityLog.create({
                data: {
                    type: ActivityType.TASK_STATUS_CHANGED,
                    userId,
                    taskId,
                    metadata: {
                        fromStatus: currentTask.status,
                        toStatus: dto.status,
                    },
                },
            });

            return task;
        });
    }

    private async getTaskOrThrow(taskId: string) {
        const task = await this.prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });

        if (!task) {
            throw new NotFoundException('Задача не найдена');
        }

        return task;
    }

    private async ensureUserExists(
        userId: string,
    ) {
        const user =
            await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },

                select: {
                    id: true,
                },
            });

        if (!user) {
            throw new NotFoundException(
                'Исполнитель не найден',
            );
        }
    }
}