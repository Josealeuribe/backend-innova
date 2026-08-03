import { DocumentoRecibidoRepository } from '../../../domain/repositories/documento-recibido.repository';
import { DocumentoRecibidoCufeExistenteError } from '../../errors/recepcion-dian.errors';
import { UblParserService } from '../../services/ubl-parser.service';

export interface CargarDocumentoManualCommand {
  idRazonSocial: number;
  idCasino?: number;
  xmlContent: string;
}

export class CargarDocumentoManualUseCase {
  constructor(
    private readonly documentoRecibidoRepository: DocumentoRecibidoRepository,
    private readonly ublParserService: UblParserService,
  ) {}

  async execute(command: CargarDocumentoManualCommand) {
    const parseado = this.ublParserService.parsear(command.xmlContent);

    if (parseado.cufe) {
      const existente = await this.documentoRecibidoRepository.findByCufe(
        parseado.cufe,
      );

      if (existente) {
        throw new DocumentoRecibidoCufeExistenteError();
      }
    }

    return this.documentoRecibidoRepository.create({
      idRazonSocial: command.idRazonSocial,
      idCasino: command.idCasino ?? null,
      cufe: parseado.cufe,
      tipoDocumento: parseado.tipoDocumento,
      prefijo: parseado.prefijo,
      consecutivo: parseado.consecutivo,
      numeroDocumentoCompleto: parseado.numeroDocumentoCompleto,
      nitEmisor: parseado.nitEmisor,
      nombreEmisor: parseado.nombreEmisor,
      fechaEmision: parseado.fechaEmision,
      subtotal: parseado.subtotal,
      iva: parseado.iva,
      ica: parseado.ica,
      retencionFuente: parseado.retencionFuente,
      reteIva: parseado.reteIva,
      reteIca: parseado.reteIca,
      totalPagar: parseado.totalPagar,
      xmlOriginal: command.xmlContent,
      origen: 'MANUAL',
      items: parseado.items,
    });
  }
}
