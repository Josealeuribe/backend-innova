import { Inject, Injectable } from '@nestjs/common';
import { RazonSocialRepository } from '../../domain/repositories/razon-social.repository';
import { RAZON_SOCIAL_REPOSITORY } from '../../domain/repositories/razon-social.repository.token';
import { RazonSocialNotFoundError } from '../../errors/razon-social.errors';
import { PrismaRazonSocialRepository } from '../../persistence/prisma/prisma-razon-social.repository';

@Injectable()
export class ObtenerRazonSocialUseCase {
  constructor(@Inject(RAZON_SOCIAL_REPOSITORY) private readonly repository: PrismaRazonSocialRepository) {}
  async execute(id: number) { const item = await this.repository.findById(id); if (!item) throw new RazonSocialNotFoundError(id); return item; }
}
