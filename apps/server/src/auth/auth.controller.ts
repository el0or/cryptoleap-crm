import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { IRegisterRequest, ILoginRequest } from '@cryptoleap_crm/shared';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() data: IRegisterRequest) {
        return this.authService.register(data);
    };

    @Post('login')
    async login(@Body() data: ILoginRequest) {
        return this.authService.login(data);
    };
}
