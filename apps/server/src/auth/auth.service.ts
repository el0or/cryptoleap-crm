import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { IRegisterRequest, ILoginRequest, IAuthResponse } from '@cryptoleap_crm/shared';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(data: IRegisterRequest): Promise<IAuthResponse> {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });

    return {
      user: { id: user.id, email: user.email, role: user.role as any },
    };
  }

  async login(data: ILoginRequest): Promise<IAuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return {
      user: { id: user.id, email: user.email, role: user.role as any },
    };
  }
}