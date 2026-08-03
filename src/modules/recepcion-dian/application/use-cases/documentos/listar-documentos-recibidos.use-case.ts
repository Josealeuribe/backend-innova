import {
  DocumentoRecibidoRepository,
  ListDocumentosRecibidosQuery,
} from '../../../domain/repositories/documento-recibido.repository';

export class ListarDocumentosRecibidosUseCase {
  constructor(
    private readonly documentoRecibidoRepository: DocumentoRecibidoRepository,
  ) {}

  execute(query: ListDocumentosRecibidosQuery) {
    return this.documentoRecibidoRepository.findMany(query);
  }
}
