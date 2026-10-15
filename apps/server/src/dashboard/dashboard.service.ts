import { Injectable } from "@nestjs/common";
import { TaskStatus, ActivityType } from "@prisma/client";
import { DEFAULT_DASHBOARD_WIDGETS, type DashboardActivityPeriod, type DashboardActivityType, type DashboardWidgetType, type IDashboardLayout, type IDashboardRecentActivityItem, type IDashboardSummary, type IDashboardTaskActivityPoint } from '@cryptoleap_crm/shared';
import { PrismaService } from "src/prisma/prisma.service";
import { PresenceService } from "src/presence/presence.service";

@Injectable()
export class DashboardService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly presenceService: PresenceService,
    ) {}

    async getSummary(): Promise<IDashboardSummary> {
        const now = new Date();
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const [
            usersOnline,
            usersTotal,
            tasksActive,
            tasksCompleted,
            tasksOverdue,
            tasksCreatedToday,
        ] = await Promise.all([
            this.presenceService.getOnlineCount(),
            this.prisma.user.count(),

            this.prisma.task.count({
                where: {
                    status: {
                        in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
                    },
                },
            }),

            this.prisma.task.count({
                where: {
                    status: TaskStatus.DONE,
                },
            }),

            this.prisma.task.count({
                where: {
                    status: {
                        in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
                    },
                    dueAt: {
                        lt: now,
                    },
                },
            }),

            this.prisma.task.count({
                where: {
                    createdAt: {
                        gte: today,
                    },
                },
            }),
        ]);

        return {
            usersOnline,
            usersTotal,
            tasksActive,
            tasksCompleted,
            tasksOverdue,
            tasksCreatedToday,
        };
    }

    async getLayout(userId: string): Promise<IDashboardLayout> {
        const layout = await this.prisma.dashboardLayout.findUnique({
            where: {
                userId,
            },
            select: {
                widgets: true,
            },
        });

        if (!layout) {
            return {
                widgets: [...DEFAULT_DASHBOARD_WIDGETS]
            };
        }

        return {
            widgets: layout.widgets as DashboardWidgetType[],
        };
    }

    async updateLayout(userId: string, widgets: DashboardWidgetType[]): Promise<IDashboardLayout> {
        const layout = await this.prisma.dashboardLayout.upsert({
            where: {
                userId,
            },
            update: {
                widgets,
            },
            create: {
                userId,
                widgets,
            },
            select: {
                widgets: true,
            },
        });

        return {
            widgets: layout.widgets as DashboardWidgetType[],
        }
    }

    async getTaskActivity(days: DashboardActivityPeriod): Promise<IDashboardTaskActivityPoint[]> {
        const startDate = new Date();

        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(startDate.getDate() - days + 1);

        const tasks = await this.prisma.task.findMany({
            where: {
                OR: [
                    {
                        createdAt: {
                            gte: startDate,
                        },
                    },
                    {
                        completedAt: {
                            gte: startDate,
                        },
                    },
                ],
            },
            select: {
                createdAt: true,
                completedAt: true,
            },
        });

        const activity = new Map<string, IDashboardTaskActivityPoint>();
        
        for (let index = 0; index < days; index++) {
            const date = new Date(startDate);

            date.setDate(startDate.getDate() + index);
            const key = this.formatDateKey(date);

            activity.set(key, {
                date: key,
                created: 0,
                completed: 0,
            });
        }

        for (const task of tasks) {
            const createdKey = this.formatDateKey(task.createdAt);
            const completedKey = task.completedAt ? this.formatDateKey(task.completedAt) : null;

            if (activity.has(createdKey)) {
                activity.get(createdKey)!.created += 1;
            }

            if (completedKey && activity.has(completedKey)) {
                activity.get(completedKey)!.completed += 1;
            }
        }

        return Array.from(activity.values());
    }

    private formatDateKey(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    private getActivityMessage(type: ActivityType, taskTitle: string | null, metadata: unknown): string {
        const title = taskTitle ? `«${taskTitle}»` : 'задача';

        if (type === ActivityType.TASK_CREATED) {
            return `Создана задача ${title}`;
        }

        if (type === ActivityType.TASK_UPDATED) {
            return `Обновлена задача ${title}`;
        }

        if (type === ActivityType.TASK_ASSIGNEE_CHANGED) {
            return `Изменён исполнитель задачи ${title}`;
        }

        if (type === ActivityType.TASK_STATUS_CHANGED) {
            const fromStatus = this.getMetadataString(metadata, 'fromStatus');
            const toStatus = this.getMetadataString(metadata, 'toStatus');

            if (fromStatus && toStatus) {
                return `Статус задачи ${title}: ${this.getTaskStatusLabel(fromStatus)} → ${this.getTaskStatusLabel(toStatus)}`;
            }

            return `Изменён статус задачи ${title}`;
        }

        return `Обновлена задача ${title}`;
    }

    private getMetadataString(metadata: unknown, key: string): string | null {
        if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
            return null;
        }

        const value = (metadata as Record<string, unknown>)[key];

        return typeof value === 'string' ? value : null;
    }

    private getTaskStatusLabel(status: string): string {
        if (status === TaskStatus.TODO) {
            return 'К выполнению';
        }

        if (status === TaskStatus.IN_PROGRESS) {
            return 'В работе';
        }

        if (status === TaskStatus.DONE) {
            return 'Завершена';
        }

        if (status === TaskStatus.CANCELED) {
            return 'Отменена';
        }

        return status;
    }

    async getRecentActivity(limit: number): Promise<IDashboardRecentActivityItem[]> {
        const activities = await this.prisma.activityLog.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                type: true,
                metadata: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                task: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        return activities.map((activity) => ({
            id: activity.id,
            type: activity.type as DashboardActivityType,
            message: this.getActivityMessage(activity.type, activity.task?.title ?? null, activity.metadata),
            createdAt: activity.createdAt.toISOString(),
            user: activity.user,
            task: activity.task,
        }));
    }
}