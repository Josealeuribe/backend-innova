import { Inject, Injectable } from '@nestjs/common';

import { ControlAccesoRepository, PaginacionQuery, UpdateAccionData } from '../../domain/repositories/control-acceso.repository';
import { CONTROL_ACCESO_REPOSITORY } from '../../domain/repositories/control-acceso.repository.token';
import {
  ControlAccesoActiveDependenciesError,
  ControlAccesoDuplicateError,
  ControlAccesoNotFoundError,
} from '../../errors/control-acceso.errors';
import { ControlAccesoRulesService } from '../services/control-acceso-rules.service';
import { PrismaControlAccesoRepository } from '../../persistence/prisma/prisma-control-acceso.repository';

export interface CrearAccionCommand {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  estado?: 'ACTIVO' | 'INACTIVO';
}

export type ActualizarAccionCommand = Partial<CrearAccionCommand>;

@Injectable()
export class GestionarAccionesUseCase {
  constructor(
    @Inject(CONTROL_ACCESO_REPOSITORY)
    private readonly repository: PrismaControlAccesoRepository,
  ) {}

  async create(command: CrearAccionCommand) {
    const codigo = ControlAccesoRulesService.normalizeCode(command.codigo);
    const existing = await this.repository.findAccionIdByCodigo(codigo);

    if (existing) {
      throw new ControlAccesoDuplicateError(
        `Ya existe una acción con el código ${codigo}.`,
      );
    }

    return this.repository.createAccion({
      codigo,
      nombre: ControlAccesoRulesService.normalizeText(command.nombre),
      descripcion: ControlAccesoRulesService.normalizeNullable(command.descripcion),
      estado: command.estado ?? 'ACTIVO',
    });
  }

  async list(query: PaginacionQuery) {
    const result = await this.repository.listAcciones(query);
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

  async get(idAccion: number) {
    const accion = await this.repository.findAccionById(idAccion);
    if (!accion) throw new ControlAccesoNotFoundError('una acción', idAccion);
    return accion;
  }

  async update(idAccion: number, command: ActualizarAccionCommand) {
    await this.get(idAccion);
    const data: UpdateAccionData = {};

    if (command.codigo !== undefined) {
      const codigo = ControlAccesoRulesService.normalizeCode(command.codigo);
      const existing = await this.repository.findAccionIdByCodigo(codigo);
      if (existing && existing !== idAccion) {
        throw new ControlAccesoDuplicateError(
          `Ya existe una acción con el código ${codigo}.`,
        );
      }
      data.codigo = codigo;
    }

    if (command.nombre !== undefined) {
      data.nombre = ControlAccesoRulesService.normalizeText(command.nombre);
    }
    if (command.descripcion !== undefined) {
      data.descripcion = ControlAccesoRulesService.normalizeNullable(command.descripcion);
    }
    if (command.estado !== undefined) data.estado = command.estado;

    return this.repository.updateAccion(idAccion, data);
  }

  async deactivate(idAccion: number) {
    const current = await this.get(idAccion);
    if (current.estado === 'INACTIVO') return current;

    const permissions = await this.repository.countActivePermissionsByAction(idAccion);
    if (permissions > 0) {
      throw new ControlAccesoActiveDependenciesError(
        `La acción no puede inactivarse porque tiene ${permissions} permiso(s) activo(s).`,
      );
    }

    return this.repository.deactivateAccion(idAccion);
  }
}
