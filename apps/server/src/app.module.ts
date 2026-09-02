import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { PresenceModule } from './presence/presence.module';
import { TasksModule } from './tasks/tasks.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [ ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, PresenceModule, TasksModule, DashboardModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
