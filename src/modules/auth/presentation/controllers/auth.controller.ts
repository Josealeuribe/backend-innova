import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  InactiveAccountError,
  InvalidCredentialsError,
} from '../../application/errors/auth.errors';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoginRequestDto } from '../dto/login-request.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequestDto) {
    try {
      return await this.loginUseCase.execute({
        correo: dto.correo,
        contrasena: dto.contrasena,
      });
    } catch (error: unknown) {
      if (
        error instanceof InvalidCredentialsError ||
        error instanceof InactiveAccountError
      ) {
        throw new UnauthorizedException('Correo o contraseña incorrectos.');
      }

      throw error;
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  profile(@Req() request: AuthenticatedRequest) {
    return {
      usuario: request.user,
    };
  }
}
