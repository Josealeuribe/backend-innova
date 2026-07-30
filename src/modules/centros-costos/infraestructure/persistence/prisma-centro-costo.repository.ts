import { Injectable } from '@nestjs/common';

import {
  EstadoRegistro,
  Prisma,
} from 'src/generated/prisma/client';

import {
  PrismaService,
} from 'src/shared/database/prisma/prisma.service';

import {
  CentroCostoEntity,
  EstadoCentroCosto,
} from '../../domain/entities/centro-costo.entity';

import {
  CentroCostoRepository,
  CreateCentroCostoData,
  ListCentrosCostosQuery,
  ListCentrosCostosResult,
  UpdateCentroCostoData,
} from '../../domain/repositories/centro-costo.repository';

const centroCostoSelect = {
  idCentroCosto: true,
  codigoCentroCosto: true,
  nombreCentroCosto: true,
  estado: true,
  fechaCreacion: true,
  fechaActualizacion: true,
} satisfies Prisma.CentroCostoSelect;

type CentroCostoRecord =
  Prisma.CentroCostoGetPayload<{
    select: typeof centroCostoSelect;
  }>;

@Injectable()
export class PrismaCentroCostoRepository
  implements CentroCostoRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async create(
    data: CreateCentroCostoData,
  ): Promise<CentroCostoEntity> {
    const centroCosto =
      await this.prisma.centroCosto.create({
        data: {
          codigoCentroCosto:
            data.codigoCentroCosto,

          nombreCentroCosto:
            data.nombreCentroCosto,

          estado: this.mapEstadoToPrisma(
            data.estado,
          ),
        },

        select: centroCostoSelect,
      });

    return this.mapCentroCosto(
      centroCosto,
    );
  }

  async findById(
    idCentroCosto: number,
  ): Promise<CentroCostoEntity | null> {
    const centroCosto =
      await this.prisma.centroCosto.findUnique({
        where: {
          idCentroCosto,
        },

        select: centroCostoSelect,
      });

    return centroCosto
      ? this.mapCentroCosto(
          centroCosto,
        )
      : null;
  }

  async findIdByCodigo(
    codigoCentroCosto: string,
  ): Promise<number | null> {
    const centroCosto =
      await this.prisma.centroCosto.findUnique({
        where: {
          codigoCentroCosto,
        },

        select: {
          idCentroCosto: true,
        },
      });

    return (
      centroCosto?.idCentroCosto ??
      null
    );
  }

  async findMany(
    query: ListCentrosCostosQuery,
  ): Promise<ListCentrosCostosResult> {
    const where:
      Prisma.CentroCostoWhereInput = {};

    if (query.estado) {
      where.estado =
        this.mapEstadoToPrisma(
          query.estado,
        );
    }

    if (query.buscar) {
      where.OR = [
        {
          codigoCentroCosto: {
            contains: query.buscar,
          },
        },

        {
          nombreCentroCosto: {
            contains: query.buscar,
          },
        },
      ];
    }

    const skip =
      (query.page - 1) * query.limit;

    const [
      centrosCostos,
      total,
    ] = await Promise.all([
      this.prisma.centroCosto.findMany({
        where,
        skip,
        take: query.limit,

        orderBy: {
          codigoCentroCosto: 'asc',
        },

        select: centroCostoSelect,
      }),

      this.prisma.centroCosto.count({
        where,
      }),
    ]);

    return {
      centrosCostos:
        centrosCostos.map(
          (centroCosto) =>
            this.mapCentroCosto(
              centroCosto,
            ),
        ),

      total,
    };
  }

  async update(
    idCentroCosto: number,
    data: UpdateCentroCostoData,
  ): Promise<CentroCostoEntity> {
    const centroCosto =
      await this.prisma.centroCosto.update({
        where: {
          idCentroCosto,
        },

        data: {
          codigoCentroCosto:
            data.codigoCentroCosto,

          nombreCentroCosto:
            data.nombreCentroCosto,

          estado:
            data.estado === undefined
              ? undefined
              : this.mapEstadoToPrisma(
                  data.estado,
                ),
        },

        select: centroCostoSelect,
      });

    return this.mapCentroCosto(
      centroCosto,
    );
  }

  async deactivate(
    idCentroCosto: number,
  ): Promise<CentroCostoEntity> {
    const centroCosto =
      await this.prisma.centroCosto.update({
        where: {
          idCentroCosto,
        },

        data: {
          estado:
            EstadoRegistro.INACTIVO,
        },

        select: centroCostoSelect,
      });

    return this.mapCentroCosto(
      centroCosto,
    );
  }

  private mapCentroCosto(
    centroCosto: CentroCostoRecord,
  ): CentroCostoEntity {
    return {
      idCentroCosto:
        centroCosto.idCentroCosto,

      codigoCentroCosto:
        centroCosto.codigoCentroCosto,

      nombreCentroCosto:
        centroCosto.nombreCentroCosto,

      estado:
        centroCosto.estado as
          EstadoCentroCosto,

      fechaCreacion:
        centroCosto.fechaCreacion,

      fechaActualizacion:
        centroCosto.fechaActualizacion,
    };
  }

  private mapEstadoToPrisma(
    estado: EstadoCentroCosto,
  ): EstadoRegistro {
    return estado === 'ACTIVO'
      ? EstadoRegistro.ACTIVO
      : EstadoRegistro.INACTIVO;
  }
}