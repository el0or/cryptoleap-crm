import { Controller, Get, Post, Req  } from '@nestjs/common';
import type { Request } from 'express';
import { PresenceService } from './presence.service';
import { JwtPayload } from '../auth/jwt-payload.interface';

type AuthenticatedRequest = Request & { user: JwtPayload };

@Controller('api/presence')
export class PresenceController {
    constructor(
        private readonly presenceService: PresenceService,
    ) {}

    @Post('heartbeat')
    heartbeat(
        @Req()
        request: AuthenticatedRequest,
    ) {
        return this.presenceService.heartbeat(
            request.user.sub,
        );
    }

    @Get('online-count')
    getOnlineCount() {
        return this.presenceService.getOnlineCount();
    }
}