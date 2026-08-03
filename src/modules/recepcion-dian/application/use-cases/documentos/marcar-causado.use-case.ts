import { DocumentoRecibidoRepository } from '../../../domain/repositories/documento-recibido.repository';
import {
  DocumentoRecibidoNotFoundError,
  DocumentoRecibidoSinItemsMapeadosError,
  TransicionEstadoInvalidaError,
} from '../../errors/recepcion-dian.errors';

const ESTADOS_ORIGEN_VALIDOS = ['PENDIENTE', 'CONCILIADO'];

export class MarcarCausadoUseCase {
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

    if (!ESTADOS_ORIGEN_VALIDOS.includes(documento.estadoCausacion)) {
      throw new TransicionEstadoInvalidaError(
        documento.estadoCausacion,
        'CAUSADO',
      );
    }

    if (documento.items.length === 0) {
      throw new DocumentoRecibidoSinItemsMapeadosError();
    }

    const algunSinMapear = documento.items.some(
      (item) => item.estadoMapeo !== 'MAPEADO',
    );

    if (algunSinMapear) {
      throw new DocumentoRecibidoSinItemsMapeadosError();
    }

    return this.documentoRecibidoRepository.actualizarEstado(
      idDocumentoRecibido,
      'CAUSADO',
    );
  }
}
