import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PresenceService {
    constructor (
        private readonly prisma: PrismaService,
    ) {}

    async heartbeat(
        userId: string,
    ) {
        const lastSeenAt = new Date();

        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                lastSeenAt,
            },
            select: {
                id: true,
                lastSeenAt: true,
            },
        });
    }

    async getOnlineCount() {
        const onlineSince = new Date(Date.now() - 60_000,);

        const count = await this.prisma.user.count({
            where: {
                lastSeenAt: {
                    gte: onlineSince,
                },
            },
        });

        return (
            count
        );
    }
}