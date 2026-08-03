import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import type { AuthenticatedRequest } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';

import {
  ClienteDianNotFoundError,
  FacturaElectronicaNotFoundError,
  FacturaElectronicaSinItemsError,
  RangoResolucionAgotadoError,
  RazonSocialDianNotFoundError,
  RazonSocialSinCredencialesDianError,
  ResolucionDianExpiradaError,
  ResolucionDianNoActivaError,
} from '../../application/errors/dian-emision.errors';
import { CrearFacturaElectronicaUseCase } from '../../application/use-cases/facturas/crear-factura-electronica.use-case';
import { ListarFacturasElectronicasUseCase } from '../../application/use-cases/facturas/listar-facturas-electronicas.use-case';
import { ObtenerFacturaElectronicaUseCase } from '../../application/use-cases/facturas/obtener-factura-electronica.use-case';
import { ObtenerResumenDianUseCase } from '../../application/use-cases/facturas/obtener-resumen-dian.use-case';
import { ObtenerXmlFacturaElectronicaUseCase } from '../../application/use-cases/facturas/obtener-xml-factura-electronica.use-case';
import { CrearFacturaElectronicaDto } from '../dto/facturas/crear-factura-electronica.dto';
import { ListarFacturasElectronicasQueryDto } from '../dto/facturas/listar-facturas-electronicas-query.dto';

@Controller('dian')
@UseGuards(JwtAuthGuard)
export class FacturasDianController {
  constructor(
    private readonly crearFacturaElectronicaUseCase: CrearFacturaElectronicaUseCase,
    private readonly listarFacturasElectronicasUseCase: ListarFacturasElectronicasUseCase,
    private readonly obtenerFacturaElectronicaUseCase: ObtenerFacturaElectronicaUseCase,
    private readonly obtenerXmlFacturaElectronicaUseCase: ObtenerXmlFacturaElectronicaUseCase,
    private readonly obtenerResumenDianUseCase: ObtenerResumenDianUseCase,
  ) {}

  @Post('facturas')
  async create(
    @Body() dto: CrearFacturaElectronicaDto,
    @Req() request: AuthenticatedRequest,
  ) {
    try {
      return await this.crearFacturaElectronicaUseCase.execute({
        idRazonSocial: dto.idRazonSocial,
        idClienteDian: dto.idClienteDian,
        idUsuario: request.user.sub,
        entorno: dto.entorno,
        items: dto.items,
      });
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Get('facturas')
  findAll(@Query() query: ListarFacturasElectronicasQueryDto) {
    return this.listarFacturasElectronicasUseCase.execute({
      page: query.page,
      limit: query.limit,
      idRazonSocial: query.idRazonSocial,
      estadoDian: query.estadoDian,
    });
  }

  @Get('facturas/:idFacturaElectronica')
  async findOne(
    @Param('idFacturaElectronica', ParseIntPipe) idFacturaElectronica: number,
  ) {
    try {
      return await this.obtenerFacturaElectronicaUseCase.execute(
        idFacturaElectronica,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Get('facturas/:idFacturaElectronica/xml')
  async descargarXml(
    @Param('idFacturaElectronica', ParseIntPipe) idFacturaElectronica: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { xmlContent, nombreArchivoXml } =
        await this.obtenerXmlFacturaElectronicaUseCase.execute(
          idFacturaElectronica,
        );

      res.set({
        'Content-Type': 'application/xml',
        'Content-Disposition': `attachment; filename="${nombreArchivoXml}"`,
      });

      return xmlContent;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Get('resumen')
  obtenerResumen(@Query('idRazonSocial') idRazonSocial?: string) {
    return this.obtenerResumenDianUseCase.execute(
      idRazonSocial ? Number(idRazonSocial) : undefined,
    );
  }

  private handleError(error: unknown): never {
    if (
      error instanceof FacturaElectronicaNotFoundError ||
      error instanceof ClienteDianNotFoundError ||
      error instanceof RazonSocialDianNotFoundError
    ) {
      throw new NotFoundException(error.message);
    }

    if (
      error instanceof FacturaElectronicaSinItemsError ||
      error instanceof RazonSocialSinCredencialesDianError ||
      error instanceof ResolucionDianNoActivaError ||
      error instanceof RangoResolucionAgotadoError ||
      error instanceof ResolucionDianExpiradaError
    ) {
      throw new UnprocessableEntityException(error.message);
    }

    throw error;
  }
}
