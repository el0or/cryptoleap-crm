import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { PresenceModule } from './presence/presence.module';

@Module({
  imports: [ ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, PresenceModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
