import {
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  InventarioRepository,
  UpdateInventarioData,
} from '../../domain/repositories/inventario.repository';
import {
  InventarioCasinoNotFoundError,
  InventarioCodigoAlreadyExistsError,
  InventarioNotFoundError,
  InventarioResponsableNotFoundError,
  InventarioSerialAlreadyExistsError,
} from '../../errors/inventario.errors';
import { INVENTARIO_REPOSITORY } from '../../inventario.tokens';
import { InventarioRulesService } from '../services/inventario-rules.service';
import { CrearInventarioCommand } from './crear-inventario.use-case';
import { PrismaInventarioRepository } from '../../infraestructure/persistence/prisma.inventario.repository';

export type ActualizarInventarioCommand =
  Partial<CrearInventarioCommand> & {
    estadoRegistro?:
      | 'ACTIVO'
      | 'INACTIVO';
  };

@Injectable()
export class ActualizarInventarioUseCase {
  constructor(
    @Inject(INVENTARIO_REPOSITORY)
    private readonly repository:
      PrismaInventarioRepository,
  ) {}

  async execute(
    idInventario: number,
    command:
      ActualizarInventarioCommand,
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

    const data: UpdateInventarioData = {};

    if (command.codigo !== undefined) {
      const codigo =
        InventarioRulesService.normalizeCode(
          command.codigo,
        );

      const existingId =
        await this.repository.findIdByCodigo(
          codigo,
        );

      if (
        existingId &&
        existingId !== idInventario
      ) {
        throw new InventarioCodigoAlreadyExistsError(
          codigo,
        );
      }

      data.codigo = codigo;
    }

    if (command.serial !== undefined) {
      const serial =
        InventarioRulesService.normalizeNullable(
          command.serial,
        );

      if (serial) {
        const existingId =
          await this.repository.findIdBySerial(
            serial,
          );

        if (
          existingId &&
          existingId !== idInventario
        ) {
          throw new InventarioSerialAlreadyExistsError(
            serial,
          );
        }
      }

      data.serial = serial;
    }

    if (command.cantidad !== undefined) {
      InventarioRulesService.validateCantidad(
        command.cantidad,
      );
      data.cantidad = command.cantidad;
    }

    if (command.valor !== undefined) {
      InventarioRulesService.validateValor(
        command.valor,
      );
      data.valor = command.valor;
    }

    const nextCasino =
      command.idCasino ??
      current.idCasino;

    const nextResponsable =
      command.idResponsable === undefined
        ? current.idResponsable
        : command.idResponsable;

    if (
      command.idCasino !== undefined ||
      command.idResponsable !== undefined
    ) {
      const relations =
        await this.repository.checkRelations(
          nextCasino,
          nextResponsable,
        );

      if (!relations.casinoExists) {
        throw new InventarioCasinoNotFoundError(
          nextCasino,
        );
      }

      if (
        nextResponsable &&
        !relations.responsableExists
      ) {
        throw new InventarioResponsableNotFoundError(
          nextResponsable,
        );
      }
    }

    if (command.fotoSerial !== undefined) {
      data.fotoSerial =
        InventarioRulesService.normalizeNullable(
          command.fotoSerial,
        );
    }

    if (command.fotoEstado !== undefined) {
      data.fotoEstado =
        InventarioRulesService.normalizeNullable(
          command.fotoEstado,
        );
    }

    if (command.nombre !== undefined) {
      data.nombre =
        InventarioRulesService.normalizeRequired(
          command.nombre,
        );
    }

    if (
      command.clasificacion !== undefined
    ) {
      data.clasificacion =
        InventarioRulesService.normalizeRequired(
          command.clasificacion,
        );
    }

    if (command.estado !== undefined) {
      data.estado = command.estado;
    }

    if (
      command.estadoRegistro !== undefined
    ) {
      data.estadoRegistro =
        command.estadoRegistro;
    }

    if (command.idCasino !== undefined) {
      data.idCasino = command.idCasino;
    }

    if (
      command.idResponsable !== undefined
    ) {
      data.idResponsable =
        command.idResponsable;
    }

    if (
      command.ubicacionLocal !== undefined
    ) {
      data.ubicacionLocal =
        InventarioRulesService.normalizeNullable(
          command.ubicacionLocal,
        );
    }

    if (
      command.fechaAdquisicion !== undefined
    ) {
      data.fechaAdquisicion =
        command.fechaAdquisicion
          ? new Date(
              command.fechaAdquisicion,
            )
          : null;
    }

    if (
      command.observaciones !== undefined
    ) {
      data.observaciones =
        InventarioRulesService.normalizeNullable(
          command.observaciones,
        );
    }

    return this.repository.update(
      idInventario,
      data,
    );
  }
}
