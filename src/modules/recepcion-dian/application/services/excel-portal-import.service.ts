import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';

import { TipoDocumentoRecibido } from '../../domain/entities/documento-recibido.entity';
import { ExcelPortalInvalidoError } from '../errors/recepcion-dian.errors';

export interface FilaExcelPortal {
  cufe: string | null;
  tipoDocumento: TipoDocumentoRecibido;
  numeroDocumentoCompleto: string;
  nitEmisor: string;
  nombreEmisor: string;
  fechaEmision: Date;
  totalPagar: number;
}

/**
 * Nombres de columna aceptados (case-insensitive, sin tildes) por cada
 * campo — el export "Documentos Recibidos" del portal DIAN no tiene un
 * formato 100% estable entre actualizaciones del portal; se aceptan
 * variantes razonables en vez de exigir un encabezado exacto.
 */
const COLUMNAS: Record<keyof Omit<FilaExcelPortal, 'tipoDocumento' | 'fechaEmision'>, string[]> = {
  cufe: ['cufe', 'cude'],
  numeroDocumentoCompleto: ['numero', 'numero documento', 'documento', 'folio'],
  nitEmisor: ['nit emisor', 'nit', 'identificacion emisor'],
  nombreEmisor: ['nombre emisor', 'razon social emisor', 'emisor'],
  totalPagar: ['valor', 'valor total', 'total', 'valor a pagar'],
};

const TIPO_COLUMNAS = ['tipo documento', 'tipo', 'tipo de documento'];
const FECHA_COLUMNAS = ['fecha emision', 'fecha de emision', 'fecha'];

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();
}

function detectarTipoDocumento(valor: string): TipoDocumentoRecibido {
  const texto = normalizar(valor);

  if (texto.includes('credito')) return 'NOTA_CREDITO';
  if (texto.includes('debito')) return 'NOTA_DEBITO';
  return 'FACTURA';
}

/**
 * Puerto simplificado de la importación del Excel "Documentos Recibidos"
 * del portal DIAN (`ges-innova` la resuelve junto al conector; aquí solo
 * se soporta la carga manual del archivo exportado por el usuario).
 */
@Injectable()
export class ExcelPortalImportService {
  async parsear(buffer: Buffer): Promise<FilaExcelPortal[]> {
    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
    } catch {
      throw new ExcelPortalInvalidoError('no se pudo leer el archivo .xlsx.');
    }

    const worksheet = workbook.worksheets[0];

    if (!worksheet || worksheet.rowCount < 2) {
      throw new ExcelPortalInvalidoError(
        'el archivo no tiene filas de datos.',
      );
    }

    const headerRow = worksheet.getRow(1);
    const indicePorColumna = new Map<string, number>();

    headerRow.eachCell((cell, colNumber) => {
      indicePorColumna.set(normalizar(String(cell.value ?? '')), colNumber);
    });

    const buscarIndice = (candidatos: string[]): number | null => {
      for (const candidato of candidatos) {
        const indice = indicePorColumna.get(candidato);
        if (indice) return indice;
      }
      return null;
    };

    const indices = {
      cufe: buscarIndice(COLUMNAS.cufe),
      numeroDocumentoCompleto: buscarIndice(COLUMNAS.numeroDocumentoCompleto),
      nitEmisor: buscarIndice(COLUMNAS.nitEmisor),
      nombreEmisor: buscarIndice(COLUMNAS.nombreEmisor),
      totalPagar: buscarIndice(COLUMNAS.totalPagar),
      tipoDocumento: buscarIndice(TIPO_COLUMNAS),
      fechaEmision: buscarIndice(FECHA_COLUMNAS),
    };

    if (!indices.numeroDocumentoCompleto || !indices.nitEmisor) {
      throw new ExcelPortalInvalidoError(
        'no se encontraron las columnas obligatorias (NIT emisor / Número de documento).',
      );
    }

    const filas: FilaExcelPortal[] = [];

    for (let numeroFila = 2; numeroFila <= worksheet.rowCount; numeroFila++) {
      const fila = worksheet.getRow(numeroFila);

      const numeroDocumentoCompleto = String(
        fila.getCell(indices.numeroDocumentoCompleto).value ?? '',
      ).trim();

      if (!numeroDocumentoCompleto) continue;

      const nitEmisor = String(
        fila.getCell(indices.nitEmisor).value ?? '',
      ).trim();

      const nombreEmisor = indices.nombreEmisor
        ? String(fila.getCell(indices.nombreEmisor).value ?? '').trim()
        : 'Desconocido';

      const cufeValor = indices.cufe
        ? String(fila.getCell(indices.cufe).value ?? '').trim()
        : '';

      const tipoValor = indices.tipoDocumento
        ? String(fila.getCell(indices.tipoDocumento).value ?? '')
        : '';

      const fechaCelda = indices.fechaEmision
        ? fila.getCell(indices.fechaEmision).value
        : null;

      const fechaEmision =
        fechaCelda instanceof Date ? fechaCelda : new Date(String(fechaCelda ?? ''));

      const totalCelda = indices.totalPagar
        ? fila.getCell(indices.totalPagar).value
        : 0;

      filas.push({
        cufe: cufeValor || null,
        tipoDocumento: detectarTipoDocumento(tipoValor),
        numeroDocumentoCompleto,
        nitEmisor,
        nombreEmisor,
        fechaEmision: Number.isNaN(fechaEmision.getTime())
          ? new Date()
          : fechaEmision,
        totalPagar: Number(totalCelda) || 0,
      });
    }

    return filas;
  }
}
