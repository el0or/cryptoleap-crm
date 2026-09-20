import { Controller, Get, Body, Put, Req } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { Request } from "express";
import type { JwtPayload } from "../auth/jwt-payload.interface";
import { UpdateDashboardLayoutDto } from "./dto/update-dashboard-layout.dto";

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
}