import {
  FacturaElectronicaRepository,
  ListFacturasElectronicasQuery,
} from '../../../domain/repositories/factura-electronica.repository';

export class ListarFacturasElectronicasUseCase {
  constructor(
    private readonly facturaElectronicaRepository: FacturaElectronicaRepository,
  ) {}

  execute(query: ListFacturasElectronicasQuery) {
    return this.facturaElectronicaRepository.findMany(query);
  }
}
