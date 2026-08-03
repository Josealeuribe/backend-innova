import { Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';

import { TipoDocumentoRecibido } from '../../domain/entities/documento-recibido.entity';
import { XmlInvalidoError } from '../errors/recepcion-dian.errors';

const MAX_XML_SIZE_BYTES = 15 * 1024 * 1024;

const ROOT_TAG_TO_TIPO: Record<string, TipoDocumentoRecibido> = {
  Invoice: 'FACTURA',
  CreditNote: 'NOTA_CREDITO',
  DebitNote: 'NOTA_DEBITO',
};

const ARRAY_TAGS = new Set([
  'InvoiceLine',
  'CreditNoteLine',
  'DebitNoteLine',
  'TaxTotal',
  'TaxSubtotal',
]);

export interface ItemParseado {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  codigoImpuesto1: string;
  valorImpuesto1: number;
  codigoImpuesto2: string | null;
  valorImpuesto2: number;
  codigoImpuesto3: string | null;
  valorImpuesto3: number;
  total: number;
}

export interface DocumentoParseado {
  cufe: string | null;
  tipoDocumento: TipoDocumentoRecibido;
  prefijo: string | null;
  consecutivo: string | null;
  numeroDocumentoCompleto: string;
  nitEmisor: string;
  nombreEmisor: string;
  fechaEmision: Date;
  subtotal: number;
  iva: number;
  ica: number;
  retencionFuente: number;
  reteIva: number;
  reteIca: number;
  totalPagar: number;
  items: ItemParseado[];
}

/** Extrae el valor de texto de un nodo, que fast-xml-parser puede
 * representar como string/number directo o como `{ '#text': ... }`
 * cuando el nodo tiene atributos. */
function textoDe(nodo: unknown): string | null {
  if (nodo === null || nodo === undefined) return null;
  if (typeof nodo === 'string' || typeof nodo === 'number') {
    return String(nodo);
  }
  if (typeof nodo === 'object' && '#text' in (nodo as Record<string, unknown>)) {
    return String((nodo as Record<string, unknown>)['#text']);
  }
  return null;
}

function numeroDe(nodo: unknown): number {
  const texto = textoDe(nodo);
  return texto ? Number(texto) : 0;
}

function asArray<T>(valor: T | T[] | undefined): T[] {
  if (valor === undefined) return [];
  return Array.isArray(valor) ? valor : [valor];
}

/**
 * Puerto simplificado de `ges-innova/app/services/dian/recepcion/xml_parser.py`
 * — parsea el XML UBL 2.1 de un documento RECIBIDO de un proveedor
 * (Invoice/CreditNote/DebitNote). Usa `fast-xml-parser` con
 * `removeNSPrefix` para detectar los nodos por nombre local, igual que
 * el original ignora el namespace. `fast-xml-parser` no resuelve DTDs
 * ni entidades externas — no hace falta configuración adicional contra XXE.
 */
@Injectable()
export class UblParserService {
  parsear(xmlContent: string): DocumentoParseado {
    if (Buffer.byteLength(xmlContent, 'utf8') > MAX_XML_SIZE_BYTES) {
      throw new XmlInvalidoError(
        'el archivo supera el tamaño máximo permitido (15MB).',
      );
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      removeNSPrefix: true,
      textNodeName: '#text',
      // Sin esto, fast-xml-parser convierte "01" en el número 1 y se
      // pierde el cero a la izquierda de los códigos de impuesto DIAN
      // (01=IVA, 03=ICA, ...), rompiendo la comparación por código.
      parseTagValue: false,
      isArray: (name) => ARRAY_TAGS.has(name),
    });

    let parsed: Record<string, unknown>;

    try {
      parsed = parser.parse(xmlContent);
    } catch {
      throw new XmlInvalidoError('no se pudo interpretar el contenido XML.');
    }

    const rootTag = Object.keys(ROOT_TAG_TO_TIPO).find(
      (tag) => parsed[tag] !== undefined,
    );

    if (!rootTag) {
      throw new XmlInvalidoError(
        'el nodo raíz no es Invoice, CreditNote ni DebitNote.',
      );
    }

    const tipoDocumento = ROOT_TAG_TO_TIPO[rootTag];
    const doc = parsed[rootTag] as Record<string, unknown>;

    const cufe = textoDe(doc['UUID']);
    const numeroDocumentoCompleto = textoDe(doc['ID']) ?? '';

    const { prefijo, consecutivo } = this.dividirNumero(
      numeroDocumentoCompleto,
    );

    const fechaEmision = this.parsearFechaHora(
      textoDe(doc['IssueDate']),
      textoDe(doc['IssueTime']),
    );

    const supplier =
      (doc['AccountingSupplierParty'] as Record<string, unknown>) ?? {};
    const { nit: nitEmisor, nombre: nombreEmisor } = this.extraerParty(
      supplier,
    );

    const legalMonetaryTotal =
      (doc['LegalMonetaryTotal'] as Record<string, unknown>) ?? {};

    const subtotal = numeroDe(legalMonetaryTotal['LineExtensionAmount']);
    const totalPagar = numeroDe(
      legalMonetaryTotal['PayableAmount'] ??
        legalMonetaryTotal['LineExtensionAmount'],
    );

    const impuestosCabecera = this.acumularImpuestos(
      asArray(doc['TaxTotal'] as Record<string, unknown>[] | undefined),
    );

    const lineTag = ['InvoiceLine', 'CreditNoteLine', 'DebitNoteLine'].find(
      (tag) => doc[tag] !== undefined,
    );

    const items = lineTag
      ? asArray(doc[lineTag] as Record<string, unknown>[]).map((linea) =>
          this.parsearLinea(linea),
        )
      : [];

    return {
      cufe,
      tipoDocumento,
      prefijo,
      consecutivo,
      numeroDocumentoCompleto,
      nitEmisor,
      nombreEmisor,
      fechaEmision,
      subtotal,
      iva: impuestosCabecera.iva,
      ica: impuestosCabecera.ica,
      retencionFuente: impuestosCabecera.retencionFuente,
      reteIva: impuestosCabecera.reteIva,
      reteIca: impuestosCabecera.reteIca,
      totalPagar,
      items,
    };
  }

  private dividirNumero(numeroCompleto: string): {
    prefijo: string | null;
    consecutivo: string | null;
  } {
    const match = /^([A-Za-z]+)(\d+)$/.exec(numeroCompleto.trim());

    if (!match) {
      return { prefijo: null, consecutivo: numeroCompleto || null };
    }

    return { prefijo: match[1], consecutivo: match[2] };
  }

  private parsearFechaHora(
    fecha: string | null,
    hora: string | null,
  ): Date {
    if (!fecha) {
      throw new XmlInvalidoError('falta la fecha de emisión (IssueDate).');
    }

    const horaLimpia = (hora ?? '00:00:00').split(/[-+]\d{2}:\d{2}$/)[0];
    const fechaHora = new Date(`${fecha}T${horaLimpia}`);

    if (Number.isNaN(fechaHora.getTime())) {
      throw new XmlInvalidoError('la fecha/hora de emisión no es válida.');
    }

    return fechaHora;
  }

  private extraerParty(party: Record<string, unknown>): {
    nit: string;
    nombre: string;
  } {
    const partyNode = (party['Party'] as Record<string, unknown>) ?? {};

    const taxScheme =
      (partyNode['PartyTaxScheme'] as Record<string, unknown>) ?? {};
    const legalEntity =
      (partyNode['PartyLegalEntity'] as Record<string, unknown>) ?? {};
    const partyName =
      (partyNode['PartyName'] as Record<string, unknown>) ?? {};

    const nit =
      textoDe(taxScheme['CompanyID']) ??
      textoDe(legalEntity['CompanyID']) ??
      '';

    const nombre =
      textoDe(taxScheme['RegistrationName']) ??
      textoDe(legalEntity['RegistrationName']) ??
      textoDe(partyName['Name']) ??
      'Desconocido';

    return { nit: nit.replace(/\s+/g, ''), nombre };
  }

  private acumularImpuestos(taxTotales: Record<string, unknown>[]): {
    iva: number;
    ica: number;
    retencionFuente: number;
    reteIva: number;
    reteIca: number;
  } {
    const acumulado = {
      iva: 0,
      ica: 0,
      retencionFuente: 0,
      reteIva: 0,
      reteIca: 0,
    };

    for (const taxTotal of taxTotales) {
      for (const subtotal of asArray(
        taxTotal['TaxSubtotal'] as Record<string, unknown>[],
      )) {
        const categoria =
          (subtotal['TaxCategory'] as Record<string, unknown>) ?? {};
        const scheme =
          (categoria['TaxScheme'] as Record<string, unknown>) ?? {};
        const codigo = textoDe(scheme['ID']);
        const monto = numeroDe(subtotal['TaxAmount']);

        switch (codigo) {
          case '01':
            acumulado.iva += monto;
            break;
          case '03':
            acumulado.ica += monto;
            break;
          case '05':
            acumulado.retencionFuente += monto;
            break;
          case '06':
            acumulado.reteIva += monto;
            break;
          case '07':
            acumulado.reteIca += monto;
            break;
          default:
            break;
        }
      }
    }

    return acumulado;
  }

  private parsearLinea(linea: Record<string, unknown>): ItemParseado {
    const item = (linea['Item'] as Record<string, unknown>) ?? {};
    const price = (linea['Price'] as Record<string, unknown>) ?? {};

    const cantidad =
      numeroDe(
        linea['InvoicedQuantity'] ??
          linea['CreditedQuantity'] ??
          linea['DebitedQuantity'],
      ) || 1;

    const precioUnitario = numeroDe(price['PriceAmount']) || 0;
    const subtotal = numeroDe(linea['LineExtensionAmount']) || cantidad * precioUnitario;

    const impuestos = this.acumularImpuestos(
      asArray(linea['TaxTotal'] as Record<string, unknown>[]),
    );

    const total = subtotal + impuestos.iva + impuestos.ica;

    return {
      descripcion: textoDe(item['Description']) ?? 'Sin descripción',
      cantidad,
      precioUnitario,
      subtotal,
      // Mismo convenio de 3 slots que FacturaElectronicaItem: 1=IVA, 2=INC, 3=ICA.
      codigoImpuesto1: '01',
      valorImpuesto1: impuestos.iva,
      codigoImpuesto2: null,
      valorImpuesto2: 0,
      codigoImpuesto3: impuestos.ica > 0 ? '03' : null,
      valorImpuesto3: impuestos.ica,
      total,
    };
  }
}
