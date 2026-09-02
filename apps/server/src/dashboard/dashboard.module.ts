import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { PresenceModule } from "src/presence/presence.module";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";

@Module({
    imports: [PrismaModule, PresenceModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {};