import { Injectable } from "@nestjs/common";
import { TaskStatus } from "@prisma/client";
import type { IDashboardSummary } from "@cryptoleap_crm/shared";
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
}