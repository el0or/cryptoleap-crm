import { BadRequestException, Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Put, Query, Req } from '@nestjs/common';
import { DashboardService } from "./dashboard.service";
import { Request } from "express";
import type { JwtPayload } from "../auth/jwt-payload.interface";
import { UpdateDashboardLayoutDto } from "./dto/update-dashboard-layout.dto";
import { DASHBOARD_ACTIVITY_PERIOD, type DashboardActivityPeriod } from '@cryptoleap_crm/shared';

type AuthenticatedRequest = Request & { user: JwtPayload };

@Controller('api/dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService
    ) {}

    @Get('summary')
    getSummary() {
        return this.dashboardService.getSummary();
    }

    @Get('layout')
    getLayout(@Req() request: AuthenticatedRequest) {
        return this.dashboardService.getLayout(request.user.sub);
    }

    @Put('layout')
    updateLayout(@Req() request: AuthenticatedRequest, @Body() dto: UpdateDashboardLayoutDto) {
        return this.dashboardService.updateLayout(request.user.sub, dto.widgets);
    }

    @Get('task-activity')
    getTaskActivity(
        @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: DashboardActivityPeriod
    ) {
        if (!DASHBOARD_ACTIVITY_PERIOD.includes(days as DashboardActivityPeriod)) {
            throw new BadRequestException('Допустимые периоды: 7, 30 или 90 дней');
        }
        return this.dashboardService.getTaskActivity(days as DashboardActivityPeriod);
    }
}