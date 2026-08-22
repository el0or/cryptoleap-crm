import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { IS_PUBLIC_KEY } from "./public.decorator";
import type { JwtPayload } from "./jwt-payload.interface";
import { AUTH_COOKIE_NAME } from "./auth-cookie";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const isPublic =
            this.reflector.getAllAndOverride<boolean>(
                IS_PUBLIC_KEY,
                [
                    context.getHandler(),
                    context.getClass(),
                ],
            );

        if (isPublic) {
            return true;
        }

        const request =
            context
                .switchToHttp()
                .getRequest<Request>();

        const token =
            this.extractTokenFromRequest(request);

        if (!token) {
            throw new UnauthorizedException(
                'Требуется авторизация',
            );
        }

        try {
            const payload =
                await this.jwtService.verifyAsync<JwtPayload>(
                    token,
                );

            request['user'] = payload;
        } catch {
            throw new UnauthorizedException(
                'Недействительный или истёкший токен',
            );
        }

        return true;
    }

    // private extractTokenFromHeader(
    //     request: Request,
    // ): string | undefined {
    //     const [type, token] =
    //         request.headers.authorization
    //             ?.split(' ') ?? [];

    //     return type === 'Bearer'
    //         ? token
    //         : undefined;
    // }

    private extractTokenFromRequest(
        request: Request
    ): string | undefined {
        const cookieToken = 
            request.cookies?.[AUTH_COOKIE_NAME];

        if (cookieToken) {
            return cookieToken;
        }

        const [type, token] = 
            request.headers.authorization?.split(' ') ?? [];
        
        return type === 'Bearer'
            ? token
            : undefined;
    }
}