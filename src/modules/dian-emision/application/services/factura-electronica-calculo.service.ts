import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';

import { CrearFacturaElectronicaItemData } from '../../domain/repositories/factura-electronica.repository';

export interface ItemFacturaInput {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
  codigoImpuesto1?: string;
  valorImpuesto1?: number;
  codigoImpuesto2?: string;
  valorImpuesto2?: number;
  codigoImpuesto3?: string;
  valorImpuesto3?: number;
}

export interface TotalesFactura {
  subtotal: number;
  iva: number;
  incConsumo: number;
  ica: number;
  total: number;
}

const round2 = (valor: Decimal) => valor.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();

/**
 * Recalcula items y totales en el servidor a partir de cantidades/precios.
 * Corrección deliberada vs. `ges-innova`: allí el total se calcula en el
 * cliente (Alpine.js) y el backend confía ciegamente en lo recibido.
 */
@Injectable()
export class FacturaElectronicaCalculoService {
  calcularItems(
    items: ItemFacturaInput[],
  ): CrearFacturaElectronicaItemData[] {
    return items.map((item) => this.calcularItem(item));
  }

  calcularTotalesFactura(
    items: CrearFacturaElectronicaItemData[],
  ): TotalesFactura {
    const sum = (selector: (item: CrearFacturaElectronicaItemData) => number) =>
      items.reduce(
        (acumulado, item) => acumulado.add(selector(item)),
        new Decimal(0),
      );

    const subtotal = sum((item) => item.subtotal);
    const iva = sum((item) => item.valorImpuesto1);
    const incConsumo = sum((item) => item.valorImpuesto2);
    const ica = sum((item) => item.valorImpuesto3);
    const total = subtotal.add(iva).add(incConsumo).add(ica);

    return {
      subtotal: round2(subtotal),
      iva: round2(iva),
      incConsumo: round2(incConsumo),
      ica: round2(ica),
      total: round2(total),
    };
  }

  private calcularItem(
    item: ItemFacturaInput,
  ): CrearFacturaElectronicaItemData {
    const cantidad = new Decimal(item.cantidad);
    const precioUnitario = new Decimal(item.precioUnitario);
    const descuento = new Decimal(item.descuento ?? 0);
    const subtotal = cantidad.mul(precioUnitario).sub(descuento);

    const valorImpuesto1 = new Decimal(item.valorImpuesto1 ?? 0);
    const valorImpuesto2 = new Decimal(item.valorImpuesto2 ?? 0);
    const valorImpuesto3 = new Decimal(item.valorImpuesto3 ?? 0);

    const total = subtotal
      .add(valorImpuesto1)
      .add(valorImpuesto2)
      .add(valorImpuesto3);

    return {
      descripcion: item.descripcion.trim(),
      cantidad: cantidad.toNumber(),
      precioUnitario: round2(precioUnitario),
      descuento: round2(descuento),
      subtotal: round2(subtotal),
      codigoImpuesto1: item.codigoImpuesto1 || '01',
      valorImpuesto1: round2(valorImpuesto1),
      codigoImpuesto2: item.codigoImpuesto2 || null,
      valorImpuesto2: round2(valorImpuesto2),
      codigoImpuesto3: item.codigoImpuesto3 || null,
      valorImpuesto3: round2(valorImpuesto3),
      total: round2(total),
    };
  }
}
