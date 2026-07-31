import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { InventarioRepository } from '../../domain/repositories/inventario.repository';
import { InventarioNotFoundError } from '../../errors/inventario.errors';
import { INVENTARIO_REPOSITORY } from '../../inventario.tokens';
import { PrismaInventarioRepository } from '../../infraestructure/persistence/prisma.inventario.repository';

@Injectable()
export class EliminarInventarioUseCase {
  constructor(
    @Inject(INVENTARIO_REPOSITORY)
    private readonly repository:
      PrismaInventarioRepository,
  ) {}

  async execute(
    idInventario: number,
  ) {
    const current =
      await this.repository.findById(
        idInventario,
      );

    if (!current) {
      throw new InventarioNotFoundError(
        idInventario,
      );
    }

    if (
      current.estadoRegistro ===
      'INACTIVO'
    ) {
      return current;
    }

    return this.repository.deactivate(
      idInventario,
    );
  }
}
