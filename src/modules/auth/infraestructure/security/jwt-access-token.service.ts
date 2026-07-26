import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenPayload,
  AccessTokenService,
} from '../../application/ports/access-token.service';

@Injectable()
export class JwtAccessTokenService implements AccessTokenService {
  readonly expiresInSeconds: number;

  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.expiresInSeconds = Number(
      configService.get<string>('JWT_EXPIRES_SECONDS') ?? 28800,
    );
  }

  sign(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  verify(token: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync<AccessTokenPayload>(token);
  }
}
