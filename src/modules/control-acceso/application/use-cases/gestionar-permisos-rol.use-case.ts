import { Inject, Injectable } from '@nestjs/common';

import { ControlAccesoRepository, GuardarPermisoRolData } from '../../domain/repositories/control-acceso.repository';
import { CONTROL_ACCESO_REPOSITORY } from '../../domain/repositories/control-acceso.repository.token';
import {
  ControlAccesoInvalidRelationError,
  ControlAccesoNotFoundError,
} from '../../errors/control-acceso.errors';
import { PrismaControlAccesoRepository } from '../../persistence/prisma/prisma-control-acceso.repository';

@Injectable()
export class GestionarPermisosRolUseCase {
  constructor(
    @Inject(CONTROL_ACCESO_REPOSITORY)
    private readonly repository: PrismaControlAccesoRepository,
  ) {}

  async getMatrix(idRol: number) {
    const matrix = await this.repository.getRolePermissionMatrix(idRol);
    if (!matrix) throw new ControlAccesoNotFoundError('un rol', idRol);
    return matrix;
  }

  async save(idRol: number, permisos: GuardarPermisoRolData[]) {
    const roleExists = await this.repository.roleExists(idRol);
    if (!roleExists) throw new ControlAccesoNotFoundError('un rol', idRol);

    const uniqueIds = new Set(permisos.map((item) => item.idPermiso));
    if (uniqueIds.size !== permisos.length) {
      throw new ControlAccesoInvalidRelationError(
        'La solicitud contiene permisos duplicados.',
      );
    }

    const existingPermissions = await this.repository.countPermissionsByIds(
      [...uniqueIds],
    );

    if (existingPermissions !== uniqueIds.size) {
      throw new ControlAccesoInvalidRelationError(
        'Uno o más permisos enviados no existen.',
      );
    }

    return this.repository.saveRolePermissions(idRol, permisos);
  }
}
