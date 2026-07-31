import { Inject, Injectable } from '@nestjs/common';

import { ControlAccesoRepository, PaginacionQuery, UpdatePermisoData } from '../../domain/repositories/control-acceso.repository';
import { CONTROL_ACCESO_REPOSITORY } from '../../domain/repositories/control-acceso.repository.token';
import {
  ControlAccesoActiveDependenciesError,
  ControlAccesoDuplicateError,
  ControlAccesoInvalidRelationError,
  ControlAccesoNotFoundError,
} from '../../errors/control-acceso.errors';
import { PrismaControlAccesoRepository } from '../../persistence/prisma/prisma-control-acceso.repository';

export interface CrearPermisoCommand {
  idModulo: number;
  idAccion: number;
  estado?: 'ACTIVO' | 'INACTIVO';
}

export type ActualizarPermisoCommand = Partial<CrearPermisoCommand>;

@Injectable()
export class GestionarPermisosUseCase {
  constructor(
    @Inject(CONTROL_ACCESO_REPOSITORY)
    private readonly repository: PrismaControlAccesoRepository,
  ) {}

  async create(command: CrearPermisoCommand) {
    await this.validateRelations(command.idModulo, command.idAccion);
    const existing = await this.repository.findPermisoIdByCombination(
      command.idModulo,
      command.idAccion,
    );

    if (existing) {
      throw new ControlAccesoDuplicateError(
        'Ya existe un permiso para la combinación módulo + acción seleccionada.',
      );
    }

    return this.repository.createPermiso({
      idModulo: command.idModulo,
      idAccion: command.idAccion,
      estado: command.estado ?? 'ACTIVO',
    });
  }

  async list(
    query: PaginacionQuery & { idModulo?: number; idAccion?: number },
  ) {
    const result = await this.repository.listPermisos(query);
    return {
      data: result.data,
      meta: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit),
      },
    };
  }

  async get(idPermiso: number) {
    const permiso = await this.repository.findPermisoById(idPermiso);
    if (!permiso) throw new ControlAccesoNotFoundError('un permiso', idPermiso);
    return permiso;
  }

  async update(idPermiso: number, command: ActualizarPermisoCommand) {
    const current = await this.get(idPermiso);
    const idModulo = command.idModulo ?? current.idModulo;
    const idAccion = command.idAccion ?? current.idAccion;

    await this.validateRelations(idModulo, idAccion);
    const existing = await this.repository.findPermisoIdByCombination(
      idModulo,
      idAccion,
    );

    if (existing && existing !== idPermiso) {
      throw new ControlAccesoDuplicateError(
        'Ya existe un permiso para la combinación módulo + acción seleccionada.',
      );
    }

    const data: UpdatePermisoData = {};
    if (command.idModulo !== undefined) data.idModulo = command.idModulo;
    if (command.idAccion !== undefined) data.idAccion = command.idAccion;
    if (command.estado !== undefined) data.estado = command.estado;

    return this.repository.updatePermiso(idPermiso, data);
  }

  async deactivate(idPermiso: number) {
    const current = await this.get(idPermiso);
    if (current.estado === 'INACTIVO') return current;

    const roles = await this.repository.countAllowedRolesByPermission(idPermiso);
    if (roles > 0) {
      throw new ControlAccesoActiveDependenciesError(
        `El permiso no puede inactivarse porque está habilitado para ${roles} rol(es).`,
      );
    }

    return this.repository.deactivatePermiso(idPermiso);
  }

  private async validateRelations(idModulo: number, idAccion: number) {
    const [moduleExists, actionExists] = await Promise.all([
      this.repository.moduloExists(idModulo),
      this.repository.accionExists(idAccion),
    ]);

    if (!moduleExists || !actionExists) {
      const missing = [
        !moduleExists ? `módulo ${idModulo}` : null,
        !actionExists ? `acción ${idAccion}` : null,
      ].filter(Boolean);

      throw new ControlAccesoInvalidRelationError(
        `No existen los siguientes registros relacionados: ${missing.join(', ')}.`,
      );
    }
  }
}
