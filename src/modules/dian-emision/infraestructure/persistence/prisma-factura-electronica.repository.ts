import { Injectable } from '@nestjs/common';

import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

import {
  EstadoDocumentoDian,
  FacturaElectronicaEntity,
  FacturaElectronicaItemEntity,
} from '../../domain/entities/factura-electronica.entity';
import {
  ResolucionDianEntity,
  TipoDocumentoDian,
} from '../../domain/entities/resolucion-dian.entity';
import {
  CrearFacturaElectronicaParams,
  FacturaElectronicaRepository,
  ListFacturasElectronicasQuery,
  ListFacturasElectronicasResult,
  ResumenDian,
} from '../../domain/repositories/factura-electronica.repository';
import {
  RangoResolucionAgotadoError,
  ResolucionDianExpiradaError,
  ResolucionDianNoActivaError,
} from '../../application/errors/dian-emision.errors';

const facturaElectronicaSelect = {
  idFacturaElectronica: true,
  idRazonSocial: true,
  idClienteDian: true,
  idUsuario: true,
  idResolucionDian: true,
  prefijo: true,
  consecutivo: true,
  fechaEmision: true,
  cufe: true,
  qrcodeData: true,
  xmlContent: true,
  nombreArchivoXml: true,
  estadoDian: true,
  trackId: true,
  mensajeError: true,
  subtotal: true,
  iva: true,
  incConsumo: true,
  ica: true,
  total: true,
  fechaCreacion: true,
  fechaActualizacion: true,
  items: {
    select: {
      idFacturaElectronicaItem: true,
      descripcion: true,
      cantidad: true,
      precioUnitario: true,
      descuento: true,
      subtotal: true,
      codigoImpuesto1: true,
      valorImpuesto1: true,
      codigoImpuesto2: true,
      valorImpuesto2: true,
      codigoImpuesto3: true,
      valorImpuesto3: true,
      total: true,
    },
  },
} satisfies Prisma.FacturaElectronicaSelect;

type FacturaElectronicaRecord = Prisma.FacturaElectronicaGetPayload<{
  select: typeof facturaElectronicaSelect;
}>;

interface ResolucionDianRawRow {
  // $queryRaw devuelve las columnas UnsignedInt como BigInt (a diferencia
  // del mapeo automático de Prisma) — normalizar con Number() antes de
  // cualquier operación aritmética o comparación.
  id_resolucion_dian: bigint | number;
  id_razon_social: bigint | number;
  tipo_documento: string;
  entorno: string;
  prefijo: string;
  numero_resolucion: string;
  rango_desde: bigint | number;
  rango_hasta: bigint | number;
  consecutivo_actual: bigint | number;
  fecha_vigencia_desde: Date;
  fecha_vigencia_hasta: Date;
  clave_tecnica: string;
  activa: bigint | number | boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

const toNum = (valor: unknown): number => Number(valor);

@Injectable()
export class PrismaFacturaElectronicaRepository
  implements FacturaElectronicaRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async crearFacturaElectronica(
    params: CrearFacturaElectronicaParams,
  ): Promise<FacturaElectronicaEntity> {
    return this.prisma.$transaction(async (tx) => {
      // Bloqueo pesimista de la resolución activa — puerto de
      // `ResolutionService.get_and_increment_consecutive` (ges-innova).
      const rows = await tx.$queryRaw<ResolucionDianRawRow[]>`
        SELECT * FROM dian_resoluciones
        WHERE id_razon_social = ${params.idRazonSocial}
          AND tipo_documento = 'FACTURA'
          AND entorno = ${params.entorno}
          AND activa = 1
        FOR UPDATE
      `;

      const row = rows[0];

      if (!row) {
        throw new ResolucionDianNoActivaError('FACTURA', params.entorno);
      }

      // El driver mariadb devuelve las columnas UnsignedInt/BigInt como
      // BigInt en consultas $queryRaw (a diferencia del mapeo automático
      // de Prisma) — normalizar a number antes de operar con ellas.
      const idResolucionDian = Number(row.id_resolucion_dian);
      const idRazonSocialResolucion = Number(row.id_razon_social);
      const rangoDesde = Number(row.rango_desde);
      const rangoHasta = Number(row.rango_hasta);
      const consecutivoActual = Number(row.consecutivo_actual);

      const siguienteConsecutivo = consecutivoActual + 1;

      if (siguienteConsecutivo > rangoHasta) {
        throw new RangoResolucionAgotadoError(rangoHasta);
      }

      const fechaVigenciaHasta = new Date(row.fecha_vigencia_hasta);

      if (new Date() > fechaVigenciaHasta) {
        throw new ResolucionDianExpiradaError(fechaVigenciaHasta);
      }

      await tx.$executeRaw`
        UPDATE dian_resoluciones
        SET consecutivo_actual = ${siguienteConsecutivo}
        WHERE id_resolucion_dian = ${idResolucionDian}
      `;

      const resolucion: ResolucionDianEntity = {
        idResolucionDian,
        idRazonSocial: idRazonSocialResolucion,
        tipoDocumento: row.tipo_documento as TipoDocumentoDian,
        entorno: row.entorno,
        prefijo: row.prefijo,
        numeroResolucion: row.numero_resolucion,
        rangoDesde,
        rangoHasta,
        consecutivoActual: siguienteConsecutivo,
        fechaVigenciaDesde: new Date(row.fecha_vigencia_desde),
        fechaVigenciaHasta,
        claveTecnica: row.clave_tecnica,
        activa: Boolean(row.activa),
        fechaCreacion: new Date(row.fecha_creacion),
        fechaActualizacion: new Date(row.fecha_actualizacion),
      };

      const fechaEmision = new Date();

      const documento = params.construirDocumento({
        resolucion,
        consecutivo: siguienteConsecutivo,
        fechaEmision,
      });

      const factura = await tx.facturaElectronica.create({
        data: {
          idRazonSocial: params.idRazonSocial,
          idClienteDian: params.idClienteDian,
          idUsuario: params.idUsuario,
          idResolucionDian: resolucion.idResolucionDian,
          prefijo: resolucion.prefijo,
          consecutivo: siguienteConsecutivo,
          fechaEmision,
          cufe: documento.cufe,
          qrcodeData: documento.qrcodeData,
          xmlContent: documento.xmlContent,
          nombreArchivoXml: documento.nombreArchivoXml,
          subtotal: documento.subtotal,
          iva: documento.iva,
          incConsumo: documento.incConsumo,
          ica: documento.ica,
          total: documento.total,
          items: {
            create: params.items.map((item) => ({
              descripcion: item.descripcion,
              cantidad: item.cantidad,
              precioUnitario: item.precioUnitario,
              descuento: item.descuento,
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
        select: facturaElectronicaSelect,
      });

      return this.mapFactura(factura);
    });
  }

  async findById(
    idFacturaElectronica: number,
  ): Promise<FacturaElectronicaEntity | null> {
    const factura = await this.prisma.facturaElectronica.findUnique({
      where: { idFacturaElectronica },
      select: facturaElectronicaSelect,
    });

    return factura ? this.mapFactura(factura) : null;
  }

  async findMany(
    query: ListFacturasElectronicasQuery,
  ): Promise<ListFacturasElectronicasResult> {
    const where: Prisma.FacturaElectronicaWhereInput = {};

    if (query.idRazonSocial !== undefined) {
      where.idRazonSocial = query.idRazonSocial;
    }

    if (query.estadoDian) {
      where.estadoDian = query.estadoDian;
    }

    const skip = (query.page - 1) * query.limit;

    const [facturas, total] = await Promise.all([
      this.prisma.facturaElectronica.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { fechaCreacion: 'desc' },
        select: facturaElectronicaSelect,
      }),

      this.prisma.facturaElectronica.count({ where }),
    ]);

    return {
      facturas: facturas.map((factura) => this.mapFactura(factura)),
      total,
    };
  }

  async obtenerResumen(idRazonSocial?: number): Promise<ResumenDian> {
    const where: Prisma.FacturaElectronicaWhereInput =
      idRazonSocial !== undefined ? { idRazonSocial } : {};

    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const [porEstadoRaw, agregado, facturasDelMes, ultimasFacturasRaw] =
      await Promise.all([
        this.prisma.facturaElectronica.groupBy({
          by: ['estadoDian'],
          where,
          _count: { _all: true },
        }),

        this.prisma.facturaElectronica.aggregate({
          where,
          _sum: { total: true },
        }),

        this.prisma.facturaElectronica.count({
          where: { ...where, fechaEmision: { gte: inicioMes } },
        }),

        this.prisma.facturaElectronica.findMany({
          where,
          take: 5,
          orderBy: { fechaCreacion: 'desc' },
          select: facturaElectronicaSelect,
        }),
      ]);

    return {
      porEstado: porEstadoRaw.map((grupo) => ({
        estadoDian: grupo.estadoDian as EstadoDocumentoDian,
        cantidad: grupo._count._all,
      })),
      totalFacturado: toNum(agregado._sum.total ?? 0),
      facturasDelMes,
      ultimasFacturas: ultimasFacturasRaw.map((factura) =>
        this.mapFactura(factura),
      ),
    };
  }

  private mapFactura(
    factura: FacturaElectronicaRecord,
  ): FacturaElectronicaEntity {
    return {
      idFacturaElectronica: factura.idFacturaElectronica,
      idRazonSocial: factura.idRazonSocial,
      idClienteDian: factura.idClienteDian,
      idUsuario: factura.idUsuario,
      idResolucionDian: factura.idResolucionDian,
      prefijo: factura.prefijo,
      consecutivo: factura.consecutivo,
      fechaEmision: factura.fechaEmision,
      cufe: factura.cufe,
      qrcodeData: factura.qrcodeData,
      xmlContent: factura.xmlContent,
      nombreArchivoXml: factura.nombreArchivoXml,
      estadoDian: factura.estadoDian as EstadoDocumentoDian,
      trackId: factura.trackId,
      mensajeError: factura.mensajeError,
      subtotal: toNum(factura.subtotal),
      iva: toNum(factura.iva),
      incConsumo: toNum(factura.incConsumo),
      ica: toNum(factura.ica),
      total: toNum(factura.total),
      items: factura.items.map((item) => this.mapItem(item)),
      fechaCreacion: factura.fechaCreacion,
      fechaActualizacion: factura.fechaActualizacion,
    };
  }

  private mapItem(
    item: FacturaElectronicaRecord['items'][number],
  ): FacturaElectronicaItemEntity {
    return {
      idFacturaElectronicaItem: item.idFacturaElectronicaItem,
      descripcion: item.descripcion,
      cantidad: toNum(item.cantidad),
      precioUnitario: toNum(item.precioUnitario),
      descuento: toNum(item.descuento),
      subtotal: toNum(item.subtotal),
      codigoImpuesto1: item.codigoImpuesto1,
      valorImpuesto1: toNum(item.valorImpuesto1),
      codigoImpuesto2: item.codigoImpuesto2,
      valorImpuesto2: toNum(item.valorImpuesto2),
      codigoImpuesto3: item.codigoImpuesto3,
      valorImpuesto3: toNum(item.valorImpuesto3),
      total: toNum(item.total),
    };
  }
}
