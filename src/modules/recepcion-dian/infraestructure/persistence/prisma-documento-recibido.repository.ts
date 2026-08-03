import { Injectable } from '@nestjs/common';

import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

import {
  DocumentoRecibidoEntity,
  EstadoCausacionRecibido,
  ItemCompraRecibidoEntity,
  NaturalezaContable,
  OrigenDocumentoRecibido,
  TipoDocumentoRecibido,
} from '../../domain/entities/documento-recibido.entity';
import {
  AsignarPucItemData,
  CrearDocumentoRecibidoData,
  CriterioReconciliacion,
  DocumentoRecibidoRepository,
  ListDocumentosRecibidosQuery,
  ListDocumentosRecibidosResult,
  ResumenRecepcion,
} from '../../domain/repositories/documento-recibido.repository';

const documentoRecibidoSelect = {
  idDocumentoRecibido: true,
  idRazonSocial: true,
  idCasino: true,
  cufe: true,
  tipoDocumento: true,
  prefijo: true,
  consecutivo: true,
  numeroDocumentoCompleto: true,
  nitEmisor: true,
  nombreEmisor: true,
  fechaEmision: true,
  subtotal: true,
  iva: true,
  ica: true,
  retencionFuente: true,
  reteIva: true,
  reteIca: true,
  totalPagar: true,
  xmlOriginal: true,
  qrUrl: true,
  origen: true,
  estadoCausacion: true,
  pucPreliminar: true,
  requiereRevisionConciliacion: true,
  fechaCreacion: true,
  fechaActualizacion: true,
  items: {
    select: {
      idItemCompraRecibido: true,
      descripcion: true,
      cantidad: true,
      precioUnitario: true,
      subtotal: true,
      codigoImpuesto1: true,
      valorImpuesto1: true,
      codigoImpuesto2: true,
      valorImpuesto2: true,
      codigoImpuesto3: true,
      valorImpuesto3: true,
      total: true,
      cuentaPuc: true,
      nombreCuentaPuc: true,
      centroCostos: true,
      nombreCentroCostos: true,
      naturaleza: true,
      estadoMapeo: true,
      idReglaAplicada: true,
    },
  },
} satisfies Prisma.DocumentoRecibidoSelect;

type DocumentoRecibidoRecord = Prisma.DocumentoRecibidoGetPayload<{
  select: typeof documentoRecibidoSelect;
}>;

const toNum = (valor: unknown): number => Number(valor);

@Injectable()
export class PrismaDocumentoRecibidoRepository
  implements DocumentoRecibidoRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CrearDocumentoRecibidoData,
  ): Promise<DocumentoRecibidoEntity> {
    const documento = await this.prisma.documentoRecibido.create({
      data: {
        idRazonSocial: data.idRazonSocial,
        idCasino: data.idCasino ?? undefined,
        cufe: data.cufe ?? undefined,
        tipoDocumento: data.tipoDocumento,
        prefijo: data.prefijo ?? undefined,
        consecutivo: data.consecutivo ?? undefined,
        numeroDocumentoCompleto: data.numeroDocumentoCompleto,
        nitEmisor: data.nitEmisor,
        nombreEmisor: data.nombreEmisor,
        fechaEmision: data.fechaEmision,
        subtotal: data.subtotal,
        iva: data.iva,
        ica: data.ica,
        retencionFuente: data.retencionFuente,
        reteIva: data.reteIva,
        reteIca: data.reteIca,
        totalPagar: data.totalPagar,
        xmlOriginal: data.xmlOriginal ?? undefined,
        qrUrl: data.qrUrl ?? undefined,
        origen: data.origen,
        estadoCausacion: data.estadoCausacion ?? 'PENDIENTE',
        requiereRevisionConciliacion:
          data.requiereRevisionConciliacion ?? false,
        items: {
          create: data.items.map((item) => ({
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.subtotal,
            codigoImpuesto1: item.codigoImpuesto1,
            valorImpuesto1: item.valorImpuesto1,
            codigoImpuesto2: item.codigoImpuesto2,
            valorImpuesto2: item.valorImpuesto2,
            codigoImpuesto3: item.codigoImpuesto3,
            valorImpuesto3: item.valorImpuesto3,
            total: item.total,
          })),
        },
      },
      select: documentoRecibidoSelect,
    });

    return this.mapDocumento(documento);
  }

  async findById(
    idDocumentoRecibido: number,
  ): Promise<DocumentoRecibidoEntity | null> {
    const documento = await this.prisma.documentoRecibido.findUnique({
      where: { idDocumentoRecibido },
      select: documentoRecibidoSelect,
    });

    return documento ? this.mapDocumento(documento) : null;
  }

  async findByCufe(cufe: string): Promise<DocumentoRecibidoEntity | null> {
    const documento = await this.prisma.documentoRecibido.findUnique({
      where: { cufe },
      select: documentoRecibidoSelect,
    });

    return documento ? this.mapDocumento(documento) : null;
  }

  async findByReconciliacion(
    criterio: CriterioReconciliacion,
  ): Promise<DocumentoRecibidoEntity[]> {
    const documentos = await this.prisma.documentoRecibido.findMany({
      where: {
        nitEmisor: criterio.nitEmisor,
        numeroDocumentoCompleto: criterio.numeroDocumentoCompleto,
      },
      select: documentoRecibidoSelect,
    });

    return documentos.map((documento) => this.mapDocumento(documento));
  }

  async findMany(
    query: ListDocumentosRecibidosQuery,
  ): Promise<ListDocumentosRecibidosResult> {
    const where: Prisma.DocumentoRecibidoWhereInput = {};

    if (query.idRazonSocial !== undefined) {
      where.idRazonSocial = query.idRazonSocial;
    }

    if (query.estadoCausacion) {
      where.estadoCausacion = query.estadoCausacion;
    }

    if (query.requiereRevisionConciliacion !== undefined) {
      where.requiereRevisionConciliacion = query.requiereRevisionConciliacion;
    }

    if (query.buscar) {
      where.OR = [
        { numeroDocumentoCompleto: { contains: query.buscar } },
        { nombreEmisor: { contains: query.buscar } },
        { nitEmisor: { contains: query.buscar } },
        { cufe: { contains: query.buscar } },
      ];
    }

    const skip = (query.page - 1) * query.limit;

    const [documentos, total] = await Promise.all([
      this.prisma.documentoRecibido.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { fechaCreacion: 'desc' },
        select: documentoRecibidoSelect,
      }),

      this.prisma.documentoRecibido.count({ where }),
    ]);

    return {
      documentos: documentos.map((documento) => this.mapDocumento(documento)),
      total,
    };
  }

  async asignarPucItem(
    idDocumentoRecibido: number,
    idItemCompraRecibido: number,
    data: AsignarPucItemData,
  ): Promise<DocumentoRecibidoEntity> {
    await this.prisma.itemCompraRecibido.update({
      where: { idItemCompraRecibido },
      data: {
        cuentaPuc: data.cuentaPuc,
        nombreCuentaPuc: data.nombreCuentaPuc ?? undefined,
        centroCostos: data.centroCostos ?? undefined,
        nombreCentroCostos: data.nombreCentroCostos ?? undefined,
        naturaleza: data.naturaleza,
        estadoMapeo: 'MAPEADO',
        idReglaAplicada: data.idReglaAplicada ?? undefined,
      },
    });

    const documento = await this.prisma.documentoRecibido.findUniqueOrThrow({
      where: { idDocumentoRecibido },
      select: documentoRecibidoSelect,
    });

    return this.mapDocumento(documento);
  }

  async actualizarEstado(
    idDocumentoRecibido: number,
    estadoCausacion: EstadoCausacionRecibido,
  ): Promise<DocumentoRecibidoEntity> {
    const documento = await this.prisma.documentoRecibido.update({
      where: { idDocumentoRecibido },
      data: { estadoCausacion },
      select: documentoRecibidoSelect,
    });

    return this.mapDocumento(documento);
  }

  async marcarRequiereRevision(
    idDocumentoRecibido: number,
    requiereRevisionConciliacion: boolean,
  ): Promise<DocumentoRecibidoEntity> {
    const documento = await this.prisma.documentoRecibido.update({
      where: { idDocumentoRecibido },
      data: { requiereRevisionConciliacion },
      select: documentoRecibidoSelect,
    });

    return this.mapDocumento(documento);
  }

  async delete(idDocumentoRecibido: number): Promise<void> {
    await this.prisma.documentoRecibido.delete({
      where: { idDocumentoRecibido },
    });
  }

  async obtenerResumen(idRazonSocial?: number): Promise<ResumenRecepcion> {
    const where: Prisma.DocumentoRecibidoWhereInput =
      idRazonSocial !== undefined ? { idRazonSocial } : {};

    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const [porEstadoRaw, documentosDelMes, requierenRevision, ultimosRaw] =
      await Promise.all([
        this.prisma.documentoRecibido.groupBy({
          by: ['estadoCausacion'],
          where,
          _count: { _all: true },
        }),

        this.prisma.documentoRecibido.count({
          where: { ...where, fechaEmision: { gte: inicioMes } },
        }),

        this.prisma.documentoRecibido.count({
          where: { ...where, requiereRevisionConciliacion: true },
        }),

        this.prisma.documentoRecibido.findMany({
          where,
          take: 5,
          orderBy: { fechaCreacion: 'desc' },
          select: documentoRecibidoSelect,
        }),
      ]);

    return {
      porEstado: porEstadoRaw.map((grupo) => ({
        estadoCausacion: grupo.estadoCausacion as EstadoCausacionRecibido,
        cantidad: grupo._count._all,
      })),
      documentosDelMes,
      requierenRevision,
      ultimosDocumentos: ultimosRaw.map((documento) =>
        this.mapDocumento(documento),
      ),
    };
  }

  private mapDocumento(
    documento: DocumentoRecibidoRecord,
  ): DocumentoRecibidoEntity {
    return {
      idDocumentoRecibido: documento.idDocumentoRecibido,
      idRazonSocial: documento.idRazonSocial,
      idCasino: documento.idCasino,
      cufe: documento.cufe,
      tipoDocumento: documento.tipoDocumento as TipoDocumentoRecibido,
      prefijo: documento.prefijo,
      consecutivo: documento.consecutivo,
      numeroDocumentoCompleto: documento.numeroDocumentoCompleto,
      nitEmisor: documento.nitEmisor,
      nombreEmisor: documento.nombreEmisor,
      fechaEmision: documento.fechaEmision,
      subtotal: toNum(documento.subtotal),
      iva: toNum(documento.iva),
      ica: toNum(documento.ica),
      retencionFuente: toNum(documento.retencionFuente),
      reteIva: toNum(documento.reteIva),
      reteIca: toNum(documento.reteIca),
      totalPagar: toNum(documento.totalPagar),
      xmlOriginal: documento.xmlOriginal,
      qrUrl: documento.qrUrl,
      origen: documento.origen as OrigenDocumentoRecibido,
      estadoCausacion: documento.estadoCausacion as EstadoCausacionRecibido,
      pucPreliminar: documento.pucPreliminar,
      requiereRevisionConciliacion: documento.requiereRevisionConciliacion,
      items: documento.items.map((item) => this.mapItem(item)),
      fechaCreacion: documento.fechaCreacion,
      fechaActualizacion: documento.fechaActualizacion,
    };
  }

  private mapItem(
    item: DocumentoRecibidoRecord['items'][number],
  ): ItemCompraRecibidoEntity {
    return {
      idItemCompraRecibido: item.idItemCompraRecibido,
      descripcion: item.descripcion,
      cantidad: toNum(item.cantidad),
      precioUnitario: toNum(item.precioUnitario),
      subtotal: toNum(item.subtotal),
      codigoImpuesto1: item.codigoImpuesto1,
      valorImpuesto1: toNum(item.valorImpuesto1),
      codigoImpuesto2: item.codigoImpuesto2,
      valorImpuesto2: toNum(item.valorImpuesto2),
      codigoImpuesto3: item.codigoImpuesto3,
      valorImpuesto3: toNum(item.valorImpuesto3),
      total: toNum(item.total),
      cuentaPuc: item.cuentaPuc,
      nombreCuentaPuc: item.nombreCuentaPuc,
      centroCostos: item.centroCostos,
      nombreCentroCostos: item.nombreCentroCostos,
      naturaleza: item.naturaleza as NaturalezaContable | null,
      estadoMapeo: item.estadoMapeo as ItemCompraRecibidoEntity['estadoMapeo'],
      idReglaAplicada: item.idReglaAplicada,
    };
  }
}
