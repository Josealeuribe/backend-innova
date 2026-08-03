import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';

import {
  ClienteDianDocumentoExistenteError,
  ClienteDianNotFoundError,
} from '../../application/errors/dian-emision.errors';
import { ActualizarClienteDianUseCase } from '../../application/use-cases/clientes/actualizar-cliente-dian.use-case';
import { CrearClienteDianUseCase } from '../../application/use-cases/clientes/crear-cliente-dian.use-case';
import { ListarClientesDianUseCase } from '../../application/use-cases/clientes/listar-clientes-dian.use-case';
import { ObtenerClienteDianUseCase } from '../../application/use-cases/clientes/obtener-cliente-dian.use-case';
import { ActualizarClienteDianDto } from '../dto/clientes/actualizar-cliente-dian.dto';
import { CrearClienteDianDto } from '../dto/clientes/crear-cliente-dian.dto';
import { ListarClientesDianQueryDto } from '../dto/clientes/listar-clientes-dian-query.dto';

@Controller('dian/clientes')
@UseGuards(JwtAuthGuard)
export class ClientesDianController {
  constructor(
    private readonly crearClienteDianUseCase: CrearClienteDianUseCase,
    private readonly listarClientesDianUseCase: ListarClientesDianUseCase,
    private readonly obtenerClienteDianUseCase: ObtenerClienteDianUseCase,
    private readonly actualizarClienteDianUseCase: ActualizarClienteDianUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CrearClienteDianDto) {
    try {
      return await this.crearClienteDianUseCase.execute(dto);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Get()
  findAll(@Query() query: ListarClientesDianQueryDto) {
    return this.listarClientesDianUseCase.execute({
      page: query.page,
      limit: query.limit,
      buscar: query.buscar,
    });
  }

  @Get(':idClienteDian')
  async findOne(
    @Param('idClienteDian', ParseIntPipe) idClienteDian: number,
  ) {
    try {
      return await this.obtenerClienteDianUseCase.execute(idClienteDian);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Patch(':idClienteDian')
  async update(
    @Param('idClienteDian', ParseIntPipe) idClienteDian: number,
    @Body() dto: ActualizarClienteDianDto,
  ) {
    try {
      return await this.actualizarClienteDianUseCase.execute(
        idClienteDian,
        dto,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof ClienteDianNotFoundError) {
      throw new NotFoundException(error.message);
    }

    if (error instanceof ClienteDianDocumentoExistenteError) {
      throw new ConflictException(error.message);
    }

    throw error;
  }
}
