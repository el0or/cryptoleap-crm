import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.user.findMany({
            orderBy: [
                {
                    name: 'asc',
                },
                {
                    email: 'asc',
                },
            ],
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
    }
}