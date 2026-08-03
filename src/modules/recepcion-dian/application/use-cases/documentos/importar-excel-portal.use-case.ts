import { DocumentoRecibidoRepository } from '../../../domain/repositories/documento-recibido.repository';
import { ExcelPortalImportService } from '../../services/excel-portal-import.service';
import { ReconciliacionSimpleService } from '../../services/reconciliacion-simple.service';

export interface ImportarExcelPortalCommand {
  idRazonSocial: number;
  idCasino?: number;
  buffer: Buffer;
}

export interface ImportarExcelPortalResult {
  totalFilas: number;
  creados: number;
  yaExistian: number;
  requierenRevision: number;
}

export class ImportarExcelPortalUseCase {
  constructor(
    private readonly documentoRecibidoRepository: DocumentoRecibidoRepository,
    private readonly excelPortalImportService: ExcelPortalImportService,
    private readonly reconciliacionSimpleService: ReconciliacionSimpleService,
  ) {}

  async execute(
    command: ImportarExcelPortalCommand,
  ): Promise<ImportarExcelPortalResult> {
    const filas = await this.excelPortalImportService.parsear(
      command.buffer,
    );

    const resultado: ImportarExcelPortalResult = {
      totalFilas: filas.length,
      creados: 0,
      yaExistian: 0,
      requierenRevision: 0,
    };

    for (const fila of filas) {
      const coincidencia =
        await this.reconciliacionSimpleService.buscarCoincidencia(fila);

      if (coincidencia.tipo === 'coincide') {
        resultado.yaExistian += 1;
        continue;
      }

      const requiereRevision = coincidencia.tipo === 'ambiguo';

      await this.documentoRecibidoRepository.create({
        idRazonSocial: command.idRazonSocial,
        idCasino: command.idCasino ?? null,
        cufe: fila.cufe,
        tipoDocumento: fila.tipoDocumento,
        numeroDocumentoCompleto: fila.numeroDocumentoCompleto,
        nitEmisor: fila.nitEmisor,
        nombreEmisor: fila.nombreEmisor,
        fechaEmision: fila.fechaEmision,
        subtotal: fila.totalPagar,
        iva: 0,
        ica: 0,
        retencionFuente: 0,
        reteIva: 0,
        reteIca: 0,
        totalPagar: fila.totalPagar,
        origen: 'EXCEL_PORTAL',
        requiereRevisionConciliacion: requiereRevision,
        items: [],
      });

      resultado.creados += 1;

      if (requiereRevision) {
        resultado.requierenRevision += 1;
      }
    }

    return resultado;
  }
}
