import { Injectable } from '@nestjs/common';

import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

import {
  NaturalezaContable,
  TipoDocumentoRecibido,
} from '../../domain/entities/documento-recibido.entity';
import { ReglaMapeoPucEntity } from '../../domain/entities/regla-mapeo-puc.entity';
import {
  ActualizarReglaMapeoPucData,
  CrearReglaMapeoPucData,
  ListReglasMapeoPucQuery,
  ListReglasMapeoPucResult,
  ReglaMapeoPucRepository,
} from '../../domain/repositories/regla-mapeo-puc.repository';

const reglaMapeoPucSelect = {
  idReglaMapeoPuc: true,
  idRazonSocial: true,
  nombre: true,
  concepto: true,
  nitEmisor: true,
  nombreEmisor: true,
  tipoDocumento: true,
  cuentaPuc: true,
  nombreCuentaPuc: true,
  centroCostos: true,
  naturaleza: true,
  prioridad: true,
  activa: true,
  fechaCreacion: true,
  fechaActualizacion: true,
} satisfies Prisma.ReglaMapeoPUCSelect;

type ReglaMapeoPucRecord = Prisma.ReglaMapeoPUCGetPayload<{
  select: typeof reglaMapeoPucSelect;
}>;

@Injectable()
export class PrismaReglaMapeoPucRepository
  implements ReglaMapeoPucRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CrearReglaMapeoPucData,
  ): Promise<ReglaMapeoPucEntity> {
    const regla = await this.prisma.reglaMapeoPUC.create({
      data: {
        idRazonSocial: data.idRazonSocial,
        nombre: data.nombre,
        concepto: data.concepto,
        nitEmisor: data.nitEmisor ?? undefined,
        nombreEmisor: data.nombreEmisor ?? undefined,
        tipoDocumento: data.tipoDocumento ?? undefined,
        cuentaPuc: data.cuentaPuc,
        nombreCuentaPuc: data.nombreCuentaPuc ?? undefined,
        centroCostos: data.centroCostos ?? undefined,
        naturaleza: data.naturaleza,
        prioridad: data.prioridad ?? 0,
        activa: data.activa ?? true,
      },
      select: reglaMapeoPucSelect,
    });

    return this.mapRegla(regla);
  }

  async findById(
    idReglaMapeoPuc: number,
  ): Promise<ReglaMapeoPucEntity | null> {
    const regla = await this.prisma.reglaMapeoPUC.findUnique({
      where: { idReglaMapeoPuc },
      select: reglaMapeoPucSelect,
    });

    return regla ? this.mapRegla(regla) : null;
  }

  async findMany(
    query: ListReglasMapeoPucQuery,
  ): Promise<ListReglasMapeoPucResult> {
    const where: Prisma.ReglaMapeoPUCWhereInput = {};

    if (query.idRazonSocial !== undefined) {
      where.idRazonSocial = query.idRazonSocial;
    }

    if (query.activa !== undefined) {
      where.activa = query.activa;
    }

    if (query.buscar) {
      where.OR = [
        { nombre: { contains: query.buscar } },
        { concepto: { contains: query.buscar } },
        { cuentaPuc: { contains: query.buscar } },
        { nombreEmisor: { contains: query.buscar } },
        { nitEmisor: { contains: query.buscar } },
      ];
    }

    const skip = (query.page - 1) * query.limit;

    const [reglas, total] = await Promise.all([
      this.prisma.reglaMapeoPUC.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: [{ prioridad: 'desc' }, { fechaCreacion: 'desc' }],
        select: reglaMapeoPucSelect,
      }),

      this.prisma.reglaMapeoPUC.count({ where }),
    ]);

    return {
      reglas: reglas.map((regla) => this.mapRegla(regla)),
      total,
    };
  }

  async update(
    idReglaMapeoPuc: number,
    data: ActualizarReglaMapeoPucData,
  ): Promise<ReglaMapeoPucEntity> {
    const regla = await this.prisma.reglaMapeoPUC.update({
      where: { idReglaMapeoPuc },
      data: {
        nombre: data.nombre,
        concepto: data.concepto,
        nitEmisor: data.nitEmisor,
        nombreEmisor: data.nombreEmisor,
        tipoDocumento: data.tipoDocumento,
        cuentaPuc: data.cuentaPuc,
        nombreCuentaPuc: data.nombreCuentaPuc,
        centroCostos: data.centroCostos,
        naturaleza: data.naturaleza,
        prioridad: data.prioridad,
        activa: data.activa,
      },
      select: reglaMapeoPucSelect,
    });

    return this.mapRegla(regla);
  }

  async delete(idReglaMapeoPuc: number): Promise<void> {
    await this.prisma.reglaMapeoPUC.delete({ where: { idReglaMapeoPuc } });
  }

  private mapRegla(regla: ReglaMapeoPucRecord): ReglaMapeoPucEntity {
    return {
      idReglaMapeoPuc: regla.idReglaMapeoPuc,
      idRazonSocial: regla.idRazonSocial,
      nombre: regla.nombre,
      concepto: regla.concepto,
      nitEmisor: regla.nitEmisor,
      nombreEmisor: regla.nombreEmisor,
      tipoDocumento: regla.tipoDocumento as TipoDocumentoRecibido | null,
      cuentaPuc: regla.cuentaPuc,
      nombreCuentaPuc: regla.nombreCuentaPuc,
      centroCostos: regla.centroCostos,
      naturaleza: regla.naturaleza as NaturalezaContable,
      prioridad: regla.prioridad,
      activa: regla.activa,
      fechaCreacion: regla.fechaCreacion,
      fechaActualizacion: regla.fechaActualizacion,
    };
  }
}
