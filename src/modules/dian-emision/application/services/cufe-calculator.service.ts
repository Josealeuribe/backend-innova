import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import Decimal from 'decimal.js';

import { splitNit } from './nit.util';

export interface CalcularCufeFacturaParams {
  /** Prefijo + consecutivo, p. ej. "FEV1001" */
  numDoc: string;
  /** Fecha de generación, formato 'YYYY-MM-DD' */
  fechaGen: string;
  /** Hora de generación, con o sin offset (se normaliza a '-05:00') */
  horaGen: string;
  valDs: number | string;
  codImp1?: string;
  valImp1?: number | string | null;
  codImp2?: string;
  valImp2?: number | string | null;
  codImp3?: string;
  valImp3?: number | string | null;
  valTot: number | string;
  nitEmisor: string;
  numAdq: string;
  authString: string;
  /** '1' Producción, '2' Habilitación */
  tipoAmbiente: string;
}

export interface CufeResult {
  cufe: string;
  cadena: string;
}

function formatAmount(valor: number | string | null | undefined): string {
  return new Decimal(valor ?? '0.00').toFixed(2, Decimal.ROUND_HALF_UP);
}

/**
 * Puerto fiel de `generate_dian_code` (rama `elif is_invoice:`) de
 * `ges-innova/app/services/dian/utils.py:183-194` — algoritmo de CUFE de
 * Factura Electrónica de Venta según el Anexo Técnico 1.9.
 *
 * Cualquier desviación en el orden de concatenación, el número de
 * decimales o el formato de la hora causa rechazo silencioso de la DIAN.
 * No modificar sin comparar el resultado contra la función Python original.
 */
@Injectable()
export class CufeCalculatorService {
  calcularFactura(params: CalcularCufeFacturaParams): CufeResult {
    // El CUFE usa el NIT base SIN el dígito de verificación (split_nit),
    // nunca la simple concatenación de dígitos — de lo contrario el DV
    // quedaría pegado al NIT y el hash resultante sería inválido.
    const nitEmisor = splitNit(params.nitEmisor).nit;

    const horaClean = `${params.horaGen.split('-')[0].slice(0, 8)}-05:00`;

    const taxSegment = (
      codigo: string | undefined,
      codigoDefecto: string,
      valor: number | string | null | undefined,
    ) => `${codigo || codigoDefecto}${formatAmount(valor ?? 0)}`;

    const taxesChain =
      taxSegment(params.codImp1, '01', params.valImp1) +
      taxSegment(params.codImp2, '04', params.valImp2) +
      taxSegment(params.codImp3, '03', params.valImp3);

    const cadena =
      `${params.numDoc}${params.fechaGen}${horaClean}${formatAmount(params.valDs)}` +
      `${taxesChain}${formatAmount(params.valTot)}${nitEmisor}${params.numAdq}` +
      `${params.authString}${params.tipoAmbiente || '1'}`;

    const cufe = createHash('sha384').update(cadena, 'utf8').digest('hex');

    return { cufe, cadena };
  }
}
