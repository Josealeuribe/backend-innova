import { Inject, Injectable } from '@nestjs/common';
import { ListRazonesSocialesQuery, RazonSocialRepository } from '../../domain/repositories/razon-social.repository';
import { RAZON_SOCIAL_REPOSITORY } from '../../domain/repositories/razon-social.repository.token';
import { PrismaRazonSocialRepository } from '../../persistence/prisma/prisma-razon-social.repository';

@Injectable()
export class ListarRazonesSocialesUseCase {
  constructor(@Inject(RAZON_SOCIAL_REPOSITORY) private readonly repository: PrismaRazonSocialRepository) {}
  async execute(query: ListRazonesSocialesQuery) {
    const result = await this.repository.findMany(query);
    return { data: result.razonesSociales, meta: { page: query.page, limit: query.limit, total: result.total, totalPages: Math.ceil(result.total / query.limit) } };
  }
}
