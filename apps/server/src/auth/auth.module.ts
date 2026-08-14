import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [
        JwtModule.registerAsync({
            global: true,

            imports: [
                ConfigModule,
            ],

            inject: [
                ConfigService,
            ],

            useFactory: (
                configService: ConfigService,
            ) => ({
                secret:
                    configService.getOrThrow<string>(
                        'JWT_SECRET',
                    ),

                signOptions: {
                    expiresIn: '7d',
                },
            }),
        }),
    ],

    controllers: [
        AuthController,
    ],

    providers: [
        AuthService,

        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],

    exports: [
        AuthService,
    ],
})
export class AuthModule {}