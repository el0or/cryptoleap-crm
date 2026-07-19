import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ login: dto.login }, { email: dto.email }] },
    });

    if (existingUser) {
      throw new BadRequestException('Пользователь с таким логином или email уже существует');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        email: dto.email,
        passwordHash,
      },
    });

    return this.generateToken(user.id, user.login);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { login: dto.login } });
    
    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return this.generateToken(user.id, user.login);
  }

  private generateToken(userId: string, login: string) {
    const payload = { sub: userId, login };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}