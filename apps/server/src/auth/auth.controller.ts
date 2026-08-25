import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './public.decorator';
import type { Request, response, Response } from 'express';
import { AUTH_COOKIE_NAME, getAuthCookieOptions } from './auth-cookie';
import type { JwtPayload } from './jwt-payload.interface';

type AuthenticatedRequest = Request & {
  user: JwtPayload;
};

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Public()
    @Post('register')
    async register(
        @Body() data: RegisterDto,
    ) {
        return this.authService.register(
            data,
        );
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) response: Response, 
    ) {
        const result = await this.authService.login(dto);

        response.cookie(
            AUTH_COOKIE_NAME,
            result.accessToken,
            getAuthCookieOptions(),
        )

        const { accessToken, ...data } = result;
        
        return data;
    }

    @Get('me')
    me(
        @Req() request: AuthenticatedRequest,
    ) {
        return {
            id: request.user.sub,
            email: request.user.email,
            role: request.user.role,
        };
    }

    @Post('logout')
    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    logout(
    @Res({ passthrough: true })
        response: Response,
    ) {
        response.clearCookie(
            AUTH_COOKIE_NAME,
            getAuthCookieOptions(),
        );
    }
}