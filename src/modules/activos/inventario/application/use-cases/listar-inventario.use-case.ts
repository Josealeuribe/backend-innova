import {
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  InventarioRepository,
  ListInventarioQuery,
} from '../../domain/repositories/inventario.repository';
import { INVENTARIO_REPOSITORY } from '../../inventario.tokens';
import { PrismaInventarioRepository } from '../../infraestructure/persistence/prisma.inventario.repository';

@Injectable()
export class ListarInventarioUseCase {
  constructor(
    @Inject(INVENTARIO_REPOSITORY)
    private readonly repository:
      PrismaInventarioRepository,
  ) {}

  async execute(
    query: ListInventarioQuery,
  ) {
    const result =
      await this.repository.findMany(query);

    return {
      data: result.items,
      meta: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(
          result.total / query.limit,
        ),
      },
    };
  }
}
