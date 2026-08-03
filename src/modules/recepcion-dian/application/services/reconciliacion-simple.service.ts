import { Injectable } from '@nestjs/common';

import { DocumentoRecibidoEntity } from '../../domain/entities/documento-recibido.entity';
import type { DocumentoRecibidoRepository } from '../../domain/repositories/documento-recibido.repository';
import { FilaExcelPortal } from './excel-portal-import.service';

export type ResultadoReconciliacion =
  | { tipo: 'coincide'; documento: DocumentoRecibidoEntity }
  | { tipo: 'ambiguo'; documentos: DocumentoRecibidoEntity[] }
  | { tipo: 'sin_coincidencia' };

function mismaFecha(a: Date, b: Date): boolean {
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
}

/**
 * Puerto acotado de `dian_reconciliacion_service.py` — con solo 2 canales
 * (manual XML + Excel del portal) alcanza con 2 niveles de prioridad:
 * (1) CUFE exacto si la fila del Excel lo trae, (2) número de documento +
 * NIT emisor (+ fecha si hay más de una coincidencia). Nunca fusiona
 * automáticamente ante ambigüedad — deja la decisión al usuario.
 */
@Injectable()
export class ReconciliacionSimpleService {
  constructor(
    private readonly documentoRecibidoRepository: DocumentoRecibidoRepository,
  ) {}

  async buscarCoincidencia(
    fila: FilaExcelPortal,
  ): Promise<ResultadoReconciliacion> {
    if (fila.cufe) {
      const porCufe = await this.documentoRecibidoRepository.findByCufe(
        fila.cufe,
      );

      if (porCufe) {
        return { tipo: 'coincide', documento: porCufe };
      }
    }

    const candidatos = await this.documentoRecibidoRepository.findByReconciliacion(
      {
        nitEmisor: fila.nitEmisor,
        numeroDocumentoCompleto: fila.numeroDocumentoCompleto,
        fechaEmision: fila.fechaEmision,
      },
    );

    if (candidatos.length === 0) {
      return { tipo: 'sin_coincidencia' };
    }

    if (candidatos.length === 1) {
      return { tipo: 'coincide', documento: candidatos[0] };
    }

    const porFecha = candidatos.filter((candidato) =>
      mismaFecha(candidato.fechaEmision, fila.fechaEmision),
    );

    if (porFecha.length === 1) {
      return { tipo: 'coincide', documento: porFecha[0] };
    }

    return { tipo: 'ambiguo', documentos: candidatos };
  }
}
