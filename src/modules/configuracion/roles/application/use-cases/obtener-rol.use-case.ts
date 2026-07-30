import { Inject, Injectable } from '@nestjs/common';

import { ROL_REPOSITORY } from '../../domain/repositories/rol.repository.token';
import { RolNotFoundError } from '../../errors/rol.errors';
import { PrismaRolRepository } from '../../persistence/prisma/prisma-rol.repository';

@Injectable()
export class ObtenerRolUseCase {
  constructor(
    @Inject(ROL_REPOSITORY)
    private readonly repository: PrismaRolRepository,
  ) {}

  async execute(idRol: number) {
    const rol = await this.repository.findById(idRol);

    if (!rol) {
      throw new RolNotFoundError(idRol);
    }

    return rol;
  }
}
