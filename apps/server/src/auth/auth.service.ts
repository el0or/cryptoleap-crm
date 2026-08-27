import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import type { IAuthResponse, UserRole } from '@cryptoleap_crm/shared';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

type AuthResult = {
    user: IAuthResponse['user'];
    accessToken: string;
};

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async register(
        data: RegisterDto,
    ): Promise<AuthResult> {
        const email =
            data.email
                .trim()
                .toLowerCase();

        const existingUser =
            await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });

        if (existingUser) {
            throw new BadRequestException(
                'Пользователь с таким email уже существует',
            );
        }

        const hashedPassword =
            await bcrypt.hash(
                data.password,
                10,
            );

        const user =
            await this.prisma.user.create({
                data: {
                    email,

                    password:
                        hashedPassword,

                    name:
                        data.name?.trim()
                        || null,

                    lastLoginAt:
                        new Date(),

                    lastSeenAt:
                        new Date(),
                },
            });

        return this.createAuthResponse(user);
    }

    async login(
        data: LoginDto,
    ): Promise<AuthResult> {
        const email =
            data.email
                .trim()
                .toLowerCase();

        const user =
            await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });

        if (!user) {
            throw new UnauthorizedException(
                'Неверный email или пароль',
            );
        }

        const isPasswordValid =
            await bcrypt.compare(
                data.password,
                user.password,
            );

        if (!isPasswordValid) {
            throw new UnauthorizedException(
                'Неверный email или пароль',
            );
        }

        const updatedUser =
            await this.prisma.user.update({
                where: {
                    id: user.id,
                },

                data: {
                    lastLoginAt:
                        new Date(),

                    lastSeenAt:
                        new Date(),
                },
            });

        return this.createAuthResponse(
            updatedUser,
        );
    }

    private async createAuthResponse(
        user: {
            id: string;
            email: string;
            name: string | null;
            role: string;
        },
        ): Promise<AuthResult> {
        const accessToken =
            await this.jwtService.signAsync({
                sub: user.id,
                email: user.email,
                role: user.role,
            });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role as UserRole
            },

            accessToken,
        };
    }
}