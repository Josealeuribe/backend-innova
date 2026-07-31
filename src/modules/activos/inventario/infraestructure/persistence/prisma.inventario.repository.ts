import { Injectable } from '@nestjs/common';

import {
  EstadoInventario as PrismaEstadoInventario,
  EstadoRegistro as PrismaEstadoRegistro,
  Prisma,
} from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';



import {
  CreateInventarioData,
  InventarioRelationsResult,
  InventarioRepository,
  ListInventarioQuery,
  ListInventarioResult,
  UpdateInventarioData,
} from '../../domain/repositories/inventario.repository';
import { EstadoInventario, EstadoRegistro, InventarioEntity } from '../../domain/entities/inventraio.entity';

const inventarioSelect = {
  idInventario: true,
  fotoSerial: true,
  fotoEstado: true,
  codigo: true,
  nombre: true,
  serial: true,
  clasificacion: true,
  estado: true,
  estadoRegistro: true,
  cantidad: true,
  valor: true,
  idCasino: true,
  idResponsable: true,
  ubicacionLocal: true,
  fechaAdquisicion: true,
  observaciones: true,
  fechaCreacion: true,
  fechaActualizacion: true,

  casino: {
    select: {
      idCasino: true,
      nombreCasino: true,
    },
  },

  responsable: {
    select: {
      id: true,
      nombre: true,
      apellido: true,
      correo: true,
    },
  },
} satisfies Prisma.InventarioSelect;

type InventarioRecord =
  Prisma.InventarioGetPayload<{
    select: typeof inventarioSelect;
  }>;

@Injectable()
export class PrismaInventarioRepository
  implements InventarioRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async create(
    data: CreateInventarioData,
  ): Promise<InventarioEntity> {
    const record =
      await this.prisma.inventario.create({
        data: {
          fotoSerial: data.fotoSerial,
          fotoEstado: data.fotoEstado,
          codigo: data.codigo,
          nombre: data.nombre,
          serial: data.serial,
          clasificacion:
            data.clasificacion,
          estado:
            data.estado as PrismaEstadoInventario,
          estadoRegistro:
            data.estadoRegistro as PrismaEstadoRegistro,
          cantidad: data.cantidad,
          valor: new Prisma.Decimal(
            data.valor,
          ),
          idCasino: data.idCasino,
          idResponsable:
            data.idResponsable,
          ubicacionLocal:
            data.ubicacionLocal,
          fechaAdquisicion:
            data.fechaAdquisicion,
          observaciones:
            data.observaciones,
        },
        select: inventarioSelect,
      });

    return this.toEntity(record);
  }

  async findById(
    idInventario: number,
  ): Promise<InventarioEntity | null> {
    const record =
      await this.prisma.inventario.findUnique({
        where: {
          idInventario,
        },
        select: inventarioSelect,
      });

    return record
      ? this.toEntity(record)
      : null;
  }

  async findIdByCodigo(
    codigo: string,
  ): Promise<number | null> {
    const record =
      await this.prisma.inventario.findUnique({
        where: {
          codigo,
        },
        select: {
          idInventario: true,
        },
      });

    return record?.idInventario ?? null;
  }

  async findIdBySerial(
    serial: string,
  ): Promise<number | null> {
    const record =
      await this.prisma.inventario.findUnique({
        where: {
          serial,
        },
        select: {
          idInventario: true,
        },
      });

    return record?.idInventario ?? null;
  }

  async findMany(
    query: ListInventarioQuery,
  ): Promise<ListInventarioResult> {
    const where:
      Prisma.InventarioWhereInput = {
      estado: query.estado
        ? (query.estado as PrismaEstadoInventario)
        : undefined,

      estadoRegistro:
        query.estadoRegistro
          ? (query.estadoRegistro as PrismaEstadoRegistro)
          : undefined,

      clasificacion:
        query.clasificacion
          ? {
              equals:
                query.clasificacion,
            }
          : undefined,

      idCasino: query.idCasino,
      idResponsable:
        query.idResponsable,
    };

    const search =
      query.buscar?.trim();

    if (search) {
      where.OR = [
        {
          codigo: {
            contains: search,
          },
        },
        {
          nombre: {
            contains: search,
          },
        },
        {
          serial: {
            contains: search,
          },
        },
        {
          clasificacion: {
            contains: search,
          },
        },
        {
          ubicacionLocal: {
            contains: search,
          },
        },
        {
          responsable: {
            is: {
              OR: [
                {
                  nombre: {
                    contains: search,
                  },
                },
                {
                  apellido: {
                    contains: search,
                  },
                },
                {
                  correo: {
                    contains: search,
                  },
                },
              ],
            },
          },
        },
      ];
    }

    const skip =
      (query.page - 1) *
      query.limit;

    const [records, total] =
      await this.prisma.$transaction([
        this.prisma.inventario.findMany({
          where,
          select: inventarioSelect,
          orderBy: [
            {
              fechaCreacion: 'desc',
            },
            {
              idInventario: 'desc',
            },
          ],
          skip,
          take: query.limit,
        }),

        this.prisma.inventario.count({
          where,
        }),
      ]);

    return {
      items: records.map((record) =>
        this.toEntity(record),
      ),
      total,
    };
  }

  async update(
    idInventario: number,
    data: UpdateInventarioData,
  ): Promise<InventarioEntity> {
    const record =
      await this.prisma.inventario.update({
        where: {
          idInventario,
        },
        data: {
          fotoSerial:
            data.fotoSerial,
          fotoEstado:
            data.fotoEstado,
          codigo: data.codigo,
          nombre: data.nombre,
          serial: data.serial,
          clasificacion:
            data.clasificacion,

          estado: data.estado
            ? (data.estado as PrismaEstadoInventario)
            : undefined,

          estadoRegistro:
            data.estadoRegistro
              ? (data.estadoRegistro as PrismaEstadoRegistro)
              : undefined,

          cantidad: data.cantidad,

          valor:
            data.valor !== undefined
              ? new Prisma.Decimal(
                  data.valor,
                )
              : undefined,

          idCasino: data.idCasino,
          idResponsable:
            data.idResponsable,
          ubicacionLocal:
            data.ubicacionLocal,
          fechaAdquisicion:
            data.fechaAdquisicion,
          observaciones:
            data.observaciones,
        },
        select: inventarioSelect,
      });

    return this.toEntity(record);
  }

  async deactivate(
    idInventario: number,
  ): Promise<InventarioEntity> {
    const record =
      await this.prisma.inventario.update({
        where: {
          idInventario,
        },
        data: {
          estadoRegistro:
            PrismaEstadoRegistro.INACTIVO,
        },
        select: inventarioSelect,
      });

    return this.toEntity(record);
  }

  async checkRelations(
    idCasino: number,
    idResponsable: number | null,
  ): Promise<InventarioRelationsResult> {
    const [casino, responsable] =
      await this.prisma.$transaction([
        this.prisma.casino.findFirst({
          where: {
            idCasino,
            estado:
              PrismaEstadoRegistro.ACTIVO,
          },
          select: {
            idCasino: true,
          },
        }),

        idResponsable
          ? this.prisma.usuario.findFirst({
              where: {
                id: idResponsable,
                estado:
                  PrismaEstadoRegistro.ACTIVO,
              },
              select: {
                id: true,
              },
            })
          : this.prisma.usuario.findFirst({
              where: {
                id: -1,
              },
              select: {
                id: true,
              },
            }),
      ]);

    return {
      casinoExists: Boolean(casino),
      responsableExists:
        idResponsable === null
          ? true
          : Boolean(responsable),
    };
  }

  private toEntity(
    record: InventarioRecord,
  ): InventarioEntity {
    return {
      idInventario:
        record.idInventario,
      fotoSerial:
        record.fotoSerial,
      fotoEstado:
        record.fotoEstado,
      codigo: record.codigo,
      nombre: record.nombre,
      serial: record.serial,
      clasificacion:
        record.clasificacion,
      estado:
        record.estado as EstadoInventario,
      estadoRegistro:
        record.estadoRegistro as EstadoRegistro,
      cantidad: record.cantidad,
      valor: Number(record.valor),
      idCasino: record.idCasino,
      idResponsable:
        record.idResponsable,
      ubicacionLocal:
        record.ubicacionLocal,
      fechaAdquisicion:
        record.fechaAdquisicion,
      observaciones:
        record.observaciones,
      casino: record.casino,
      responsable:
        record.responsable,
      fechaCreacion:
        record.fechaCreacion,
      fechaActualizacion:
        record.fechaActualizacion,
    };
  }
}
