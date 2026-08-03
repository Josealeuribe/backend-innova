import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';

import {
  AsignacionPucInvalidaError,
  DocumentoRecibidoCufeExistenteError,
  DocumentoRecibidoNotFoundError,
  DocumentoRecibidoSinItemsMapeadosError,
  ExcelPortalInvalidoError,
  ReglaMapeoPucNotFoundError,
  TransicionEstadoInvalidaError,
  XmlInvalidoError,
} from '../../application/errors/recepcion-dian.errors';
import { AsignarPucItemUseCase } from '../../application/use-cases/documentos/asignar-puc-item.use-case';
import { CargarDocumentoManualUseCase } from '../../application/use-cases/documentos/cargar-documento-manual.use-case';
import { EliminarDocumentoRecibidoUseCase } from '../../application/use-cases/documentos/eliminar-documento-recibido.use-case';
import { ImportarExcelPortalUseCase } from '../../application/use-cases/documentos/importar-excel-portal.use-case';
import { ListarDocumentosRecibidosUseCase } from '../../application/use-cases/documentos/listar-documentos-recibidos.use-case';
import { MarcarCausadoUseCase } from '../../application/use-cases/documentos/marcar-causado.use-case';
import { ObtenerDocumentoRecibidoUseCase } from '../../application/use-cases/documentos/obtener-documento-recibido.use-case';
import { ObtenerResumenRecepcionUseCase } from '../../application/use-cases/documentos/obtener-resumen-recepcion.use-case';
import { AsignarPucItemDto } from '../dto/documentos/asignar-puc-item.dto';
import { CargarXmlDto } from '../dto/documentos/cargar-xml.dto';
import { ImportarExcelDto } from '../dto/documentos/importar-excel.dto';
import { ListarDocumentosRecibidosQueryDto } from '../dto/documentos/listar-documentos-recibidos-query.dto';

@Controller('recepcion/documentos')
@UseGuards(JwtAuthGuard)
export class DocumentosRecibidosController {
  constructor(
    private readonly cargarDocumentoManualUseCase: CargarDocumentoManualUseCase,
    private readonly importarExcelPortalUseCase: ImportarExcelPortalUseCase,
    private readonly listarDocumentosRecibidosUseCase: ListarDocumentosRecibidosUseCase,
    private readonly obtenerDocumentoRecibidoUseCase: ObtenerDocumentoRecibidoUseCase,
    private readonly asignarPucItemUseCase: AsignarPucItemUseCase,
    private readonly marcarCausadoUseCase: MarcarCausadoUseCase,
    private readonly eliminarDocumentoRecibidoUseCase: EliminarDocumentoRecibidoUseCase,
    private readonly obtenerResumenRecepcionUseCase: ObtenerResumenRecepcionUseCase,
  ) {}

  @Post('cargar-xml')
  @UseInterceptors(FileInterceptor('file'))
  async cargarXml(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: CargarXmlDto,
  ) {
    if (!file) {
      throw new BadRequestException('Debes adjuntar un archivo XML.');
    }

    try {
      return await this.cargarDocumentoManualUseCase.execute({
        idRazonSocial: dto.idRazonSocial,
        idCasino: dto.idCasino,
        xmlContent: file.buffer.toString('utf8'),
      });
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Post('importar-excel')
  @UseInterceptors(FileInterceptor('file'))
  async importarExcel(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: ImportarExcelDto,
  ) {
    if (!file) {
      throw new BadRequestException('Debes adjuntar un archivo Excel.');
    }

    try {
      return await this.importarExcelPortalUseCase.execute({
        idRazonSocial: dto.idRazonSocial,
        idCasino: dto.idCasino,
        buffer: file.buffer,
      });
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Get()
  findAll(@Query() query: ListarDocumentosRecibidosQueryDto) {
    return this.listarDocumentosRecibidosUseCase.execute({
      page: query.page,
      limit: query.limit,
      idRazonSocial: query.idRazonSocial,
      estadoCausacion: query.estadoCausacion,
      requiereRevisionConciliacion: query.requiereRevisionConciliacion,
      buscar: query.buscar,
    });
  }

  @Get('resumen')
  obtenerResumen(@Query('idRazonSocial') idRazonSocial?: string) {
    return this.obtenerResumenRecepcionUseCase.execute(
      idRazonSocial ? Number(idRazonSocial) : undefined,
    );
  }

  @Get(':idDocumentoRecibido')
  async findOne(
    @Param('idDocumentoRecibido', ParseIntPipe) idDocumentoRecibido: number,
  ) {
    try {
      return await this.obtenerDocumentoRecibidoUseCase.execute(
        idDocumentoRecibido,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Patch(':idDocumentoRecibido/items/:idItemCompraRecibido/puc')
  async asignarPuc(
    @Param('idDocumentoRecibido', ParseIntPipe) idDocumentoRecibido: number,
    @Param('idItemCompraRecibido', ParseIntPipe)
    idItemCompraRecibido: number,
    @Body() dto: AsignarPucItemDto,
  ) {
    try {
      return await this.asignarPucItemUseCase.execute({
        idDocumentoRecibido,
        idItemCompraRecibido,
        idReglaMapeoPuc: dto.idReglaMapeoPuc,
        cuentaPuc: dto.cuentaPuc,
        nombreCuentaPuc: dto.nombreCuentaPuc,
        centroCostos: dto.centroCostos,
        nombreCentroCostos: dto.nombreCentroCostos,
        naturaleza: dto.naturaleza,
      });
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Patch(':idDocumentoRecibido/causar')
  async causar(
    @Param('idDocumentoRecibido', ParseIntPipe) idDocumentoRecibido: number,
  ) {
    try {
      return await this.marcarCausadoUseCase.execute(idDocumentoRecibido);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Delete(':idDocumentoRecibido')
  async remove(
    @Param('idDocumentoRecibido', ParseIntPipe) idDocumentoRecibido: number,
  ) {
    try {
      await this.eliminarDocumentoRecibidoUseCase.execute(
        idDocumentoRecibido,
      );

      return { message: 'Documento recibido eliminado correctamente.' };
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (
      error instanceof DocumentoRecibidoNotFoundError ||
      error instanceof ReglaMapeoPucNotFoundError
    ) {
      throw new NotFoundException(error.message);
    }

    if (error instanceof DocumentoRecibidoCufeExistenteError) {
      throw new ConflictException(error.message);
    }

    if (
      error instanceof XmlInvalidoError ||
      error instanceof ExcelPortalInvalidoError ||
      error instanceof AsignacionPucInvalidaError
    ) {
      throw new BadRequestException(error.message);
    }

    if (
      error instanceof DocumentoRecibidoSinItemsMapeadosError ||
      error instanceof TransicionEstadoInvalidaError
    ) {
      throw new UnprocessableEntityException(error.message);
    }

    throw error;
  }
}
