import { DocumentoRecibidoRepository } from '../../../domain/repositories/documento-recibido.repository';

export class ObtenerResumenRecepcionUseCase {
  constructor(
    private readonly documentoRecibidoRepository: DocumentoRecibidoRepository,
  ) {}

  execute(idRazonSocial?: number) {
    return this.documentoRecibidoRepository.obtenerResumen(idRazonSocial);
  }
}
