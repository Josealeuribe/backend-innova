import {
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  CreateInventarioData,
  InventarioRepository,
} from '../../domain/repositories/inventario.repository';
import {
  InventarioCasinoNotFoundError,
  InventarioCodigoAlreadyExistsError,
  InventarioResponsableNotFoundError,
  InventarioSerialAlreadyExistsError,
} from '../../errors/inventario.errors';
import { INVENTARIO_REPOSITORY } from '../../inventario.tokens';
import { InventarioRulesService } from '../services/inventario-rules.service';
import { PrismaInventarioRepository } from '../../infraestructure/persistence/prisma.inventario.repository';

export interface CrearInventarioCommand {
  fotoSerial?: string | null;
  fotoEstado?: string | null;

  codigo: string;
  nombre: string;
  serial?: string | null;
  clasificacion: string;

  estado?:
    | 'DISPONIBLE'
    | 'EN_USO'
    | 'EN_MANTENIMIENTO'
    | 'DANADO'
    | 'DADO_DE_BAJA';

  cantidad?: number;
  valor?: number;

  idCasino: number;
  idResponsable?: number | null;

  ubicacionLocal?: string | null;
  fechaAdquisicion?: string | null;
  observaciones?: string | null;
}

@Injectable()
export class CrearInventarioUseCase {
  constructor(
    @Inject(INVENTARIO_REPOSITORY)
    private readonly repository:
      PrismaInventarioRepository,
  ) {}

  async execute(
    command: CrearInventarioCommand,
  ) {
    const codigo =
      InventarioRulesService.normalizeCode(
        command.codigo,
      );

    const serial =
      InventarioRulesService.normalizeNullable(
        command.serial,
      );

    const existingCodeId =
      await this.repository.findIdByCodigo(
        codigo,
      );

    if (existingCodeId) {
      throw new InventarioCodigoAlreadyExistsError(
        codigo,
      );
    }

    if (serial) {
      const existingSerialId =
        await this.repository.findIdBySerial(
          serial,
        );

      if (existingSerialId) {
        throw new InventarioSerialAlreadyExistsError(
          serial,
        );
      }
    }

    const cantidad = command.cantidad ?? 1;
    const valor = command.valor ?? 0;

    InventarioRulesService.validateCantidad(
      cantidad,
    );

    InventarioRulesService.validateValor(
      valor,
    );

    const relations =
      await this.repository.checkRelations(
        command.idCasino,
        command.idResponsable ?? null,
      );

    if (!relations.casinoExists) {
      throw new InventarioCasinoNotFoundError(
        command.idCasino,
      );
    }

    if (
      command.idResponsable &&
      !relations.responsableExists
    ) {
      throw new InventarioResponsableNotFoundError(
        command.idResponsable,
      );
    }

    const data: CreateInventarioData = {
      fotoSerial:
        InventarioRulesService.normalizeNullable(
          command.fotoSerial,
        ),
      fotoEstado:
        InventarioRulesService.normalizeNullable(
          command.fotoEstado,
        ),

      codigo,
      nombre:
        InventarioRulesService.normalizeRequired(
          command.nombre,
        ),
      serial,
      clasificacion:
        InventarioRulesService.normalizeRequired(
          command.clasificacion,
        ),

      estado:
        command.estado ?? 'DISPONIBLE',
      estadoRegistro: 'ACTIVO',

      cantidad,
      valor,

      idCasino: command.idCasino,
      idResponsable:
        command.idResponsable ?? null,

      ubicacionLocal:
        InventarioRulesService.normalizeNullable(
          command.ubicacionLocal,
        ),
      fechaAdquisicion:
        command.fechaAdquisicion
          ? new Date(
              command.fechaAdquisicion,
            )
          : null,
      observaciones:
        InventarioRulesService.normalizeNullable(
          command.observaciones,
        ),
    };

    return this.repository.create(data);
  }
}
