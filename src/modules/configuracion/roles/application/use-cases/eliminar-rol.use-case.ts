import { Inject, Injectable } from '@nestjs/common';

import { ROL_REPOSITORY } from '../../domain/repositories/rol.repository.token';
import {
  RolHasActiveUsersError,
  RolNotFoundError,
} from '../../errors/rol.errors';
import { PrismaRolRepository } from '../../persistence/prisma/prisma-rol.repository';

@Injectable()
export class EliminarRolUseCase {
  constructor(
    @Inject(ROL_REPOSITORY)
    private readonly repository: PrismaRolRepository,
  ) {}

  async execute(idRol: number) {
    const current = await this.repository.findById(idRol);

    if (!current) {
      throw new RolNotFoundError(idRol);
    }

    if (current.estado === 'INACTIVO') {
      return current;
    }

    const activeUsers =
      await this.repository.countActiveUsersByRole(idRol);

    if (activeUsers > 0) {
      throw new RolHasActiveUsersError(idRol, activeUsers);
    }

    return this.repository.deactivate(idRol);
  }
}
