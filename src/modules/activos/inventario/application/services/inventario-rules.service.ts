import {
  InventarioCantidadInvalidaError,
  InventarioValorInvalidoError,
} from '../../errors/inventario.errors';

export class InventarioRulesService {
  static normalizeCode(
    codigo: string,
  ): string {
    return codigo
      .trim()
      .replace(/\s+/g, '-')
      .toUpperCase();
  }

  static normalizeRequired(
    value: string,
  ): string {
    return value
      .trim()
      .replace(/\s+/g, ' ');
  }

  static normalizeNullable(
    value?: string | null,
  ): string | null {
    if (
      value === undefined ||
      value === null
    ) {
      return null;
    }

    const normalized = value.trim();

    return normalized.length > 0
      ? normalized
      : null;
  }

  static validateCantidad(
    cantidad: number,
  ): void {
    if (
      !Number.isInteger(cantidad) ||
      cantidad <= 0
    ) {
      throw new InventarioCantidadInvalidaError();
    }
  }

  static validateValor(
    valor: number,
  ): void {
    if (
      !Number.isFinite(valor) ||
      valor < 0
    ) {
      throw new InventarioValorInvalidoError();
    }
  }
}
