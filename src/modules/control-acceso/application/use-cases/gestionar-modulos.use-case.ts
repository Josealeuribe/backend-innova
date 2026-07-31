import { Inject, Injectable } from '@nestjs/common';

import { ControlAccesoRepository, PaginacionQuery, UpdateModuloData } from '../../domain/repositories/control-acceso.repository';
import { CONTROL_ACCESO_REPOSITORY } from '../../domain/repositories/control-acceso.repository.token';
import {
  ControlAccesoActiveDependenciesError,
  ControlAccesoDuplicateError,
  ControlAccesoInvalidParentError,
  ControlAccesoNotFoundError,
} from '../../errors/control-acceso.errors';
import { ControlAccesoRulesService } from '../services/control-acceso-rules.service';
import { PrismaControlAccesoRepository } from '../../persistence/prisma/prisma-control-acceso.repository';

export interface CrearModuloCommand {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  ruta?: string | null;
  icono?: string | null;
  orden?: number;
  visibleMenu?: boolean;
  idModuloPadre?: number | null;
  estado?: 'ACTIVO' | 'INACTIVO';
}

export type ActualizarModuloCommand = Partial<CrearModuloCommand>;

@Injectable()
export class GestionarModulosUseCase {
  constructor(
    @Inject(CONTROL_ACCESO_REPOSITORY)
    private readonly repository: PrismaControlAccesoRepository,
  ) {}

  async create(command: CrearModuloCommand) {
    const codigo = ControlAccesoRulesService.normalizeCode(command.codigo);
    const existing = await this.repository.findModuloIdByCodigo(codigo);

    if (existing) {
      throw new ControlAccesoDuplicateError(
        `Ya existe un módulo con el código ${codigo}.`,
      );
    }

    await this.validateParent(command.idModuloPadre ?? null, null);

    return this.repository.createModulo({
      codigo,
      nombre: ControlAccesoRulesService.normalizeText(command.nombre),
      descripcion: ControlAccesoRulesService.normalizeNullable(command.descripcion),
      ruta: ControlAccesoRulesService.normalizeNullable(command.ruta),
      icono: ControlAccesoRulesService.normalizeNullable(command.icono),
      orden: command.orden ?? 0,
      visibleMenu: command.visibleMenu ?? true,
      idModuloPadre: command.idModuloPadre ?? null,
      estado: command.estado ?? 'ACTIVO',
    });
  }

  async list(query: PaginacionQuery) {
    const result = await this.repository.listModulos(query);
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

  async get(idModulo: number) {
    const modulo = await this.repository.findModuloById(idModulo);
    if (!modulo) throw new ControlAccesoNotFoundError('un módulo', idModulo);
    return modulo;
  }

  async update(idModulo: number, command: ActualizarModuloCommand) {
    await this.get(idModulo);
    const data: UpdateModuloData = {};

    if (command.codigo !== undefined) {
      const codigo = ControlAccesoRulesService.normalizeCode(command.codigo);
      const existing = await this.repository.findModuloIdByCodigo(codigo);
      if (existing && existing !== idModulo) {
        throw new ControlAccesoDuplicateError(
          `Ya existe un módulo con el código ${codigo}.`,
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
    if (command.ruta !== undefined) {
      data.ruta = ControlAccesoRulesService.normalizeNullable(command.ruta);
    }
    if (command.icono !== undefined) {
      data.icono = ControlAccesoRulesService.normalizeNullable(command.icono);
    }
    if (command.orden !== undefined) data.orden = command.orden;
    if (command.visibleMenu !== undefined) data.visibleMenu = command.visibleMenu;
    if (command.estado !== undefined) data.estado = command.estado;

    if (command.idModuloPadre !== undefined) {
      await this.validateParent(command.idModuloPadre, idModulo);
      data.idModuloPadre = command.idModuloPadre;
    }

    return this.repository.updateModulo(idModulo, data);
  }

  async deactivate(idModulo: number) {
    const current = await this.get(idModulo);
    if (current.estado === 'INACTIVO') return current;

    const [submodules, permissions] = await Promise.all([
      this.repository.countActiveSubmodules(idModulo),
      this.repository.countActivePermissionsByModule(idModulo),
    ]);

    if (submodules > 0 || permissions > 0) {
      throw new ControlAccesoActiveDependenciesError(
        `El módulo no puede inactivarse porque tiene ${submodules} submódulo(s) activo(s) y ${permissions} permiso(s) activo(s).`,
      );
    }

    return this.repository.deactivateModulo(idModulo);
  }

  private async validateParent(idModuloPadre: number | null, currentId: number | null) {
    if (idModuloPadre === null) return;
    if (currentId !== null && idModuloPadre === currentId) {
      throw new ControlAccesoInvalidParentError(
        'Un módulo no puede ser su propio módulo padre.',
      );
    }

    const exists = await this.repository.moduloExists(idModuloPadre);
    if (!exists) {
      throw new ControlAccesoInvalidParentError(
        `No existe el módulo padre con ID ${idModuloPadre}.`,
      );
    }
  }
}
