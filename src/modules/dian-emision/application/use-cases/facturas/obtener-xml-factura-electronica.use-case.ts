import { FacturaElectronicaRepository } from '../../../domain/repositories/factura-electronica.repository';
import { FacturaElectronicaNotFoundError } from '../../errors/dian-emision.errors';

export class ObtenerXmlFacturaElectronicaUseCase {
  constructor(
    private readonly facturaElectronicaRepository: FacturaElectronicaRepository,
  ) {}

  async execute(idFacturaElectronica: number) {
    const factura = await this.facturaElectronicaRepository.findById(
      idFacturaElectronica,
    );

    if (!factura) {
      throw new FacturaElectronicaNotFoundError();
    }

    return {
      nombreArchivoXml: factura.nombreArchivoXml,
      xmlContent: factura.xmlContent,
    };
  }
}
