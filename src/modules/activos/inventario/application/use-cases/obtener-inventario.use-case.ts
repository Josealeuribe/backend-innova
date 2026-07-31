import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { InventarioRepository } from '../../domain/repositories/inventario.repository';
import { InventarioNotFoundError } from '../../errors/inventario.errors';
import { INVENTARIO_REPOSITORY } from '../../inventario.tokens';
import { PrismaInventarioRepository } from '../../infraestructure/persistence/prisma.inventario.repository';

@Injectable()
export class ObtenerInventarioUseCase {
  constructor(
    @Inject(INVENTARIO_REPOSITORY)
    private readonly repository:
      PrismaInventarioRepository,
  ) {}

  async execute(
    idInventario: number,
  ) {
    const item =
      await this.repository.findById(
        idInventario,
      );

    if (!item) {
      throw new InventarioNotFoundError(
        idInventario,
      );
    }

    return item;
  }
}
