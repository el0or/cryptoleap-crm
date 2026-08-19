import { Injectable, NotFoundException } from "@nestjs/common";
import { TaskStatus } from "@prisma/client";
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

    async create(
        userId: string,
        dto: CreateTaskDto,
    ) {
        if (dto.assigneeId) {
            await this.ensureUserExists(
                dto.assigneeId,
            );
        }

        return this.prisma.task.create({
            data: {
                title: dto.title.trim(),
                description: dto.description ?.trim(),
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

    async update(
        taskId: string,
        dto: UpdateTaskDto,
    ) {
        await this.ensureTaskExists(
            taskId,
        );

        if (dto.assigneeId) {
            await this.ensureUserExists(
                dto.assigneeId,
            );
        }

        return this.prisma.task.update({
            where: {
                id: taskId,
            },

            data: {
                ...(dto.title !== undefined && {
                    title: dto.title.trim(),
                }),

                ...(dto.description !== undefined && {
                    description:
                        dto.description
                            ?.trim() ?? null,
                }),

                ...(dto.priority !== undefined && {
                    priority:
                        dto.priority,
                }),

                ...(dto.assigneeId !== undefined && {
                    assigneeId:
                        dto.assigneeId,
                }),

                ...(dto.dueAt !== undefined && {
                    dueAt:
                        dto.dueAt
                            ? new Date(dto.dueAt)
                            : null,
                }),
            },
        });
    }

    async updateStatus(
        taskId: string,
        dto: UpdateTaskStatusDto,
    ) {
        await this.ensureTaskExists(
            taskId,
        );

        return this.prisma.task.update({
            where: {
                id: taskId,
            },

            data: {
                status:
                    dto.status,

                completedAt:
                    dto.status === TaskStatus.DONE
                        ? new Date()
                        : null,
            },
        });
    }

    private async ensureTaskExists(
        taskId: string,
    ) {
        const task =
            await this.prisma.task.findUnique({
                where: {
                    id: taskId,
                },

                select: {
                    id: true,
                },
            });

        if (!task) {
            throw new NotFoundException(
                'Задача не найдена',
            );
        }
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