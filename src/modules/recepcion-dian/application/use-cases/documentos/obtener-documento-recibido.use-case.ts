import { DocumentoRecibidoRepository } from '../../../domain/repositories/documento-recibido.repository';
import { DocumentoRecibidoNotFoundError } from '../../errors/recepcion-dian.errors';

export class ObtenerDocumentoRecibidoUseCase {
  constructor(
    private readonly documentoRecibidoRepository: DocumentoRecibidoRepository,
  ) {}

  async execute(idDocumentoRecibido: number) {
    const documento = await this.documentoRecibidoRepository.findById(
      idDocumentoRecibido,
    );

    if (!documento) {
      throw new DocumentoRecibidoNotFoundError();
    }

    return documento;
  }
}
