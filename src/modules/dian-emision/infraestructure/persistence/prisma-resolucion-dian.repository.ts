import { Injectable } from '@nestjs/common';

import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

import {
  ResolucionDianEntity,
  TipoDocumentoDian,
} from '../../domain/entities/resolucion-dian.entity';
import {
  CreateResolucionDianData,
  ListResolucionesDianQuery,
  ListResolucionesDianResult,
  ResolucionDianRepository,
  UpdateResolucionDianData,
} from '../../domain/repositories/resolucion-dian.repository';

const resolucionDianSelect = {
  idResolucionDian: true,
  idRazonSocial: true,
  tipoDocumento: true,
  entorno: true,
  prefijo: true,
  numeroResolucion: true,
  rangoDesde: true,
  rangoHasta: true,
  consecutivoActual: true,
  fechaVigenciaDesde: true,
  fechaVigenciaHasta: true,
  claveTecnica: true,
  activa: true,
  fechaCreacion: true,
  fechaActualizacion: true,
} satisfies Prisma.ResolucionDianSelect;

type ResolucionDianRecord = Prisma.ResolucionDianGetPayload<{
  select: typeof resolucionDianSelect;
}>;

@Injectable()
export class PrismaResolucionDianRepository
  implements ResolucionDianRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateResolucionDianData,
  ): Promise<ResolucionDianEntity> {
    const resolucion = await this.prisma.resolucionDian.create({
      data: {
        idRazonSocial: data.idRazonSocial,
        tipoDocumento: data.tipoDocumento,
        entorno: data.entorno,
        prefijo: data.prefijo,
        numeroResolucion: data.numeroResolucion,
        rangoDesde: data.rangoDesde,
        rangoHasta: data.rangoHasta,
        consecutivoActual: 0,
        fechaVigenciaDesde: data.fechaVigenciaDesde,
        fechaVigenciaHasta: data.fechaVigenciaHasta,
        claveTecnica: data.claveTecnica,
        activa: data.activa ?? true,
      },
      select: resolucionDianSelect,
    });

    return this.mapResolucion(resolucion);
  }

  async findById(
    idResolucionDian: number,
  ): Promise<ResolucionDianEntity | null> {
    const resolucion = await this.prisma.resolucionDian.findUnique({
      where: { idResolucionDian },
      select: resolucionDianSelect,
    });

    return resolucion ? this.mapResolucion(resolucion) : null;
  }

  async findActiva(
    idRazonSocial: number,
    tipoDocumento: TipoDocumentoDian,
    entorno: string,
  ): Promise<ResolucionDianEntity | null> {
    const resolucion = await this.prisma.resolucionDian.findFirst({
      where: {
        idRazonSocial,
        tipoDocumento,
        entorno,
        activa: true,
      },
      select: resolucionDianSelect,
    });

    return resolucion ? this.mapResolucion(resolucion) : null;
  }

  async findMany(
    query: ListResolucionesDianQuery,
  ): Promise<ListResolucionesDianResult> {
    const where: Prisma.ResolucionDianWhereInput = {};

    if (query.idRazonSocial !== undefined) {
      where.idRazonSocial = query.idRazonSocial;
    }

    if (query.tipoDocumento) {
      where.tipoDocumento = query.tipoDocumento;
    }

    if (query.activa !== undefined) {
      where.activa = query.activa;
    }

    const skip = (query.page - 1) * query.limit;

    const [resoluciones, total] = await Promise.all([
      this.prisma.resolucionDian.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { fechaCreacion: 'desc' },
        select: resolucionDianSelect,
      }),

      this.prisma.resolucionDian.count({ where }),
    ]);

    return {
      resoluciones: resoluciones.map((resolucion) =>
        this.mapResolucion(resolucion),
      ),
      total,
    };
  }

  async update(
    idResolucionDian: number,
    data: UpdateResolucionDianData,
  ): Promise<ResolucionDianEntity> {
    const resolucion = await this.prisma.resolucionDian.update({
      where: { idResolucionDian },
      data,
      select: resolucionDianSelect,
    });

    return this.mapResolucion(resolucion);
  }

  async setActiva(
    idResolucionDian: number,
    activa: boolean,
  ): Promise<ResolucionDianEntity> {
    const resolucion = await this.prisma.resolucionDian.update({
      where: { idResolucionDian },
      data: { activa },
      select: resolucionDianSelect,
    });

    return this.mapResolucion(resolucion);
  }

  private mapResolucion(
    resolucion: ResolucionDianRecord,
  ): ResolucionDianEntity {
    return {
      idResolucionDian: resolucion.idResolucionDian,
      idRazonSocial: resolucion.idRazonSocial,
      tipoDocumento: resolucion.tipoDocumento as TipoDocumentoDian,
      entorno: resolucion.entorno,
      prefijo: resolucion.prefijo,
      numeroResolucion: resolucion.numeroResolucion,
      rangoDesde: resolucion.rangoDesde,
      rangoHasta: resolucion.rangoHasta,
      consecutivoActual: resolucion.consecutivoActual,
      fechaVigenciaDesde: resolucion.fechaVigenciaDesde,
      fechaVigenciaHasta: resolucion.fechaVigenciaHasta,
      claveTecnica: resolucion.claveTecnica,
      activa: resolucion.activa,
      fechaCreacion: resolucion.fechaCreacion,
      fechaActualizacion: resolucion.fechaActualizacion,
    };
  }
}
