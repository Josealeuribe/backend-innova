import { Module } from '@nestjs/common';

import { AuthModule } from 'src/modules/auth/auth.module';

import {
  DOCUMENTO_RECIBIDO_REPOSITORY,
  REGLA_MAPEO_PUC_REPOSITORY,
} from './recepcion-dian.tokens';

import { DocumentoRecibidoRepository } from './domain/repositories/documento-recibido.repository';
import { ReglaMapeoPucRepository } from './domain/repositories/regla-mapeo-puc.repository';

import { PrismaDocumentoRecibidoRepository } from './infraestructure/persistence/prisma-documento-recibido.repository';
import { PrismaReglaMapeoPucRepository } from './infraestructure/persistence/prisma-regla-mapeo-puc.repository';

import { ExcelPortalImportService } from './application/services/excel-portal-import.service';
import { ReconciliacionSimpleService } from './application/services/reconciliacion-simple.service';
import { UblParserService } from './application/services/ubl-parser.service';

import { AsignarPucItemUseCase } from './application/use-cases/documentos/asignar-puc-item.use-case';
import { CargarDocumentoManualUseCase } from './application/use-cases/documentos/cargar-documento-manual.use-case';
import { EliminarDocumentoRecibidoUseCase } from './application/use-cases/documentos/eliminar-documento-recibido.use-case';
import { ImportarExcelPortalUseCase } from './application/use-cases/documentos/importar-excel-portal.use-case';
import { ListarDocumentosRecibidosUseCase } from './application/use-cases/documentos/listar-documentos-recibidos.use-case';
import { MarcarCausadoUseCase } from './application/use-cases/documentos/marcar-causado.use-case';
import { ObtenerDocumentoRecibidoUseCase } from './application/use-cases/documentos/obtener-documento-recibido.use-case';
import { ObtenerResumenRecepcionUseCase } from './application/use-cases/documentos/obtener-resumen-recepcion.use-case';

import { ActualizarReglaMapeoPucUseCase } from './application/use-cases/reglas-puc/actualizar-regla-mapeo-puc.use-case';
import { CrearReglaMapeoPucUseCase } from './application/use-cases/reglas-puc/crear-regla-mapeo-puc.use-case';
import { EliminarReglaMapeoPucUseCase } from './application/use-cases/reglas-puc/eliminar-regla-mapeo-puc.use-case';
import { ListarReglasMapeoPucUseCase } from './application/use-cases/reglas-puc/listar-reglas-mapeo-puc.use-case';
import { ObtenerReglaMapeoPucUseCase } from './application/use-cases/reglas-puc/obtener-regla-mapeo-puc.use-case';

import { DocumentosRecibidosController } from './presentation/controllers/documentos-recibidos.controller';
import { ReglasPucController } from './presentation/controllers/reglas-puc.controller';

@Module({
  imports: [AuthModule],

  controllers: [DocumentosRecibidosController, ReglasPucController],

  providers: [
    UblParserService,
    ExcelPortalImportService,

    {
      provide: DOCUMENTO_RECIBIDO_REPOSITORY,
      useClass: PrismaDocumentoRecibidoRepository,
    },
    {
      provide: REGLA_MAPEO_PUC_REPOSITORY,
      useClass: PrismaReglaMapeoPucRepository,
    },

    {
      provide: ReconciliacionSimpleService,
      useFactory: (repository: DocumentoRecibidoRepository) =>
        new ReconciliacionSimpleService(repository),
      inject: [DOCUMENTO_RECIBIDO_REPOSITORY],
    },

    {
      provide: CargarDocumentoManualUseCase,
      useFactory: (
        repository: DocumentoRecibidoRepository,
        ublParserService: UblParserService,
      ) => new CargarDocumentoManualUseCase(repository, ublParserService),
      inject: [DOCUMENTO_RECIBIDO_REPOSITORY, UblParserService],
    },
    {
      provide: ImportarExcelPortalUseCase,
      useFactory: (
        repository: DocumentoRecibidoRepository,
        excelPortalImportService: ExcelPortalImportService,
        reconciliacionSimpleService: ReconciliacionSimpleService,
      ) =>
        new ImportarExcelPortalUseCase(
          repository,
          excelPortalImportService,
          reconciliacionSimpleService,
        ),
      inject: [
        DOCUMENTO_RECIBIDO_REPOSITORY,
        ExcelPortalImportService,
        ReconciliacionSimpleService,
      ],
    },
    {
      provide: ListarDocumentosRecibidosUseCase,
      useFactory: (repository: DocumentoRecibidoRepository) =>
        new ListarDocumentosRecibidosUseCase(repository),
      inject: [DOCUMENTO_RECIBIDO_REPOSITORY],
    },
    {
      provide: ObtenerDocumentoRecibidoUseCase,
      useFactory: (repository: DocumentoRecibidoRepository) =>
        new ObtenerDocumentoRecibidoUseCase(repository),
      inject: [DOCUMENTO_RECIBIDO_REPOSITORY],
    },
    {
      provide: AsignarPucItemUseCase,
      useFactory: (
        repository: DocumentoRecibidoRepository,
        reglaRepository: ReglaMapeoPucRepository,
      ) => new AsignarPucItemUseCase(repository, reglaRepository),
      inject: [DOCUMENTO_RECIBIDO_REPOSITORY, REGLA_MAPEO_PUC_REPOSITORY],
    },
    {
      provide: MarcarCausadoUseCase,
      useFactory: (repository: DocumentoRecibidoRepository) =>
        new MarcarCausadoUseCase(repository),
      inject: [DOCUMENTO_RECIBIDO_REPOSITORY],
    },
    {
      provide: EliminarDocumentoRecibidoUseCase,
      useFactory: (repository: DocumentoRecibidoRepository) =>
        new EliminarDocumentoRecibidoUseCase(repository),
      inject: [DOCUMENTO_RECIBIDO_REPOSITORY],
    },
    {
      provide: ObtenerResumenRecepcionUseCase,
      useFactory: (repository: DocumentoRecibidoRepository) =>
        new ObtenerResumenRecepcionUseCase(repository),
      inject: [DOCUMENTO_RECIBIDO_REPOSITORY],
    },

    {
      provide: CrearReglaMapeoPucUseCase,
      useFactory: (repository: ReglaMapeoPucRepository) =>
        new CrearReglaMapeoPucUseCase(repository),
      inject: [REGLA_MAPEO_PUC_REPOSITORY],
    },
    {
      provide: ListarReglasMapeoPucUseCase,
      useFactory: (repository: ReglaMapeoPucRepository) =>
        new ListarReglasMapeoPucUseCase(repository),
      inject: [REGLA_MAPEO_PUC_REPOSITORY],
    },
    {
      provide: ObtenerReglaMapeoPucUseCase,
      useFactory: (repository: ReglaMapeoPucRepository) =>
        new ObtenerReglaMapeoPucUseCase(repository),
      inject: [REGLA_MAPEO_PUC_REPOSITORY],
    },
    {
      provide: ActualizarReglaMapeoPucUseCase,
      useFactory: (repository: ReglaMapeoPucRepository) =>
        new ActualizarReglaMapeoPucUseCase(repository),
      inject: [REGLA_MAPEO_PUC_REPOSITORY],
    },
    {
      provide: EliminarReglaMapeoPucUseCase,
      useFactory: (repository: ReglaMapeoPucRepository) =>
        new EliminarReglaMapeoPucUseCase(repository),
      inject: [REGLA_MAPEO_PUC_REPOSITORY],
    },
  ],
})
export class RecepcionDianModule {}
