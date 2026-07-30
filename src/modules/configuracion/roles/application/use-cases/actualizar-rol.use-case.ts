import { Inject, Injectable } from '@nestjs/common';

import {
  UpdateRolData,
} from '../../domain/repositories/rol.repository';
import { ROL_REPOSITORY } from '../../domain/repositories/rol.repository.token';
import {
  RolHasActiveUsersError,
  RolNombreAlreadyExistsError,
  RolNotFoundError,
} from '../../errors/rol.errors';
import { RolRulesService } from '../services/rol-rules.service';
import { CrearRolCommand } from './crear-rol.use-case';
import { PrismaRolRepository } from '../../persistence/prisma/prisma-rol.repository';

export type ActualizarRolCommand = Partial<CrearRolCommand>;

@Injectable()
export class ActualizarRolUseCase {
  constructor(
    @Inject(ROL_REPOSITORY)
    private readonly repository: PrismaRolRepository,
  ) {}

  async execute(idRol: number, command: ActualizarRolCommand) {
    const current = await this.repository.findById(idRol);

    if (!current) {
      throw new RolNotFoundError(idRol);
    }

    const data: UpdateRolData = {};

    if (command.nombreRol !== undefined) {
      const nombreRol = RolRulesService.normalizeName(command.nombreRol);
      const existingId = await this.repository.findIdByNombre(nombreRol);

      if (existingId && existingId !== idRol) {
        throw new RolNombreAlreadyExistsError(nombreRol);
      }

      data.nombreRol = nombreRol;
    }

    if (command.descripcion !== undefined) {
      data.descripcion = RolRulesService.normalizeDescription(
        command.descripcion,
      );
    }

    if (command.estado !== undefined) {
      if (current.estado === 'ACTIVO' && command.estado === 'INACTIVO') {
        const activeUsers =
          await this.repository.countActiveUsersByRole(idRol);

        if (activeUsers > 0) {
          throw new RolHasActiveUsersError(idRol, activeUsers);
        }
      }

      data.estado = command.estado;
    }

    return this.repository.update(idRol, data);
  }
}
