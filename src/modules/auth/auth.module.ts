import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import type { AuthUserRepository } from './domain/repositories/auth-user.repository';

import type { AccessTokenService } from './application/ports/access-token.service';

import type { PasswordHasherService } from './application/ports/password-hasher.service';

import { LoginUseCase } from './application/use-cases/login.use-case';

import {
  ACCESS_TOKEN_SERVICE,
  AUTH_USER_REPOSITORY,
  PASSWORD_HASHER_SERVICE,
} from './auth.tokens';



import { AuthController } from './presentation/controllers/auth.controller';

import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { PrismaAuthUserRepository } from './infraestructure/persistence/prisma-auth-user.repository';
import { BcryptPasswordHasherService } from './infraestructure/security/bcrypt-password-hasher.service';
import { JwtAccessTokenService } from './infraestructure/security/jwt-access-token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: Number(
            configService.get<string>('JWT_EXPIRES_SECONDS') ?? 28800,
          ),
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    {
      provide: AUTH_USER_REPOSITORY,
      useClass: PrismaAuthUserRepository,
    },

    {
      provide: PASSWORD_HASHER_SERVICE,
      useClass: BcryptPasswordHasherService,
    },

    {
      provide: ACCESS_TOKEN_SERVICE,
      useClass: JwtAccessTokenService,
    },

    {
      provide: LoginUseCase,

      useFactory: (
        authUserRepository: AuthUserRepository,
        passwordHasherService: PasswordHasherService,
        accessTokenService: AccessTokenService,
      ) => {
        return new LoginUseCase(
          authUserRepository,
          passwordHasherService,
          accessTokenService,
        );
      },

      inject: [
        AUTH_USER_REPOSITORY,
        PASSWORD_HASHER_SERVICE,
        ACCESS_TOKEN_SERVICE,
      ],
    },

    JwtAuthGuard,
  ],

  exports: [JwtAuthGuard, ACCESS_TOKEN_SERVICE],
})
export class AuthModule {}
