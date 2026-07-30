import { Inject, Injectable } from '@nestjs/common';

import {
  CreateRolData,
} from '../../domain/repositories/rol.repository';
import { ROL_REPOSITORY } from '../../domain/repositories/rol.repository.token';
import { RolNombreAlreadyExistsError } from '../../errors/rol.errors';
import { RolRulesService } from '../services/rol-rules.service';
import { PrismaRolRepository } from '../../persistence/prisma/prisma-rol.repository';

export interface CrearRolCommand {
  nombreRol: string;
  descripcion?: string | null;
  estado?: 'ACTIVO' | 'INACTIVO';
}

@Injectable()
export class CrearRolUseCase {
  constructor(
    @Inject(ROL_REPOSITORY)
    private readonly repository: PrismaRolRepository,
  ) {}

  async execute(command: CrearRolCommand) {
    const nombreRol = RolRulesService.normalizeName(command.nombreRol);
    const existingId = await this.repository.findIdByNombre(nombreRol);

    if (existingId) {
      throw new RolNombreAlreadyExistsError(nombreRol);
    }

    const data: CreateRolData = {
      nombreRol,
      descripcion: RolRulesService.normalizeDescription(command.descripcion),
      estado: command.estado ?? 'ACTIVO',
    };

    return this.repository.create(data);
  }
}
