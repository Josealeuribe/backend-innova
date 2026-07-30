import { Inject, Injectable } from '@nestjs/common';

import {
  ListRolesQuery,
} from '../../domain/repositories/rol.repository';
import { ROL_REPOSITORY } from '../../domain/repositories/rol.repository.token';
import { PrismaRolRepository } from '../../persistence/prisma/prisma-rol.repository';

@Injectable()
export class ListarRolesUseCase {
  constructor(
    @Inject(ROL_REPOSITORY)
    private readonly repository: PrismaRolRepository,
  ) {}

  async execute(query: ListRolesQuery) {
    const result = await this.repository.findMany(query);

    return {
      data: result.roles,
      meta: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit),
      },
    };
  }
}
