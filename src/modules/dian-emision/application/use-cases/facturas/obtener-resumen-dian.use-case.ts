import { FacturaElectronicaRepository } from '../../../domain/repositories/factura-electronica.repository';

export class ObtenerResumenDianUseCase {
  constructor(
    private readonly facturaElectronicaRepository: FacturaElectronicaRepository,
  ) {}

  execute(idRazonSocial?: number) {
    return this.facturaElectronicaRepository.obtenerResumen(idRazonSocial);
  }
}
