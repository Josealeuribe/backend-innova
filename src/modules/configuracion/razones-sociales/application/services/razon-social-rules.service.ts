import { RazonSocialContratoFechasInvalidasError, RazonSocialRangoResolucionInvalidoError, RazonSocialResolucionFechasInvalidasError } from '../../errors/razon-social.errors';

export class RazonSocialRulesService {
  static validateContractDates(inicio: Date | null, fin: Date | null): void {
    if (inicio && fin && fin.getTime() < inicio.getTime()) throw new RazonSocialContratoFechasInvalidasError();
  }
  static validateResolutionDates(inicio: Date | null, fin: Date | null): void {
    if (inicio && fin && fin.getTime() < inicio.getTime()) throw new RazonSocialResolucionFechasInvalidasError();
  }
  static validateResolutionRange(inicio: string | null, fin: string | null): void {
    if (inicio && fin && BigInt(fin) < BigInt(inicio)) throw new RazonSocialRangoResolucionInvalidoError();
  }
}
