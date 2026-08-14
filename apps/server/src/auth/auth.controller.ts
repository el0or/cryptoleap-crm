import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './public.decorator';

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
        @Body() data: LoginDto,
    ) {
        return this.authService.login(
            data,
        );
    }
}