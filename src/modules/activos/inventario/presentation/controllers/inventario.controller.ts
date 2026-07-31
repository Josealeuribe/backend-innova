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
  UseGuards,
} from '@nestjs/common';



import { ActualizarInventarioUseCase } from '../../application/use-cases/actualizar-inventario.use-case';
import { CrearInventarioUseCase } from '../../application/use-cases/crear-inventario.use-case';
import { EliminarInventarioUseCase } from '../../application/use-cases/eliminar-inventario.use-case';
import { ListarInventarioUseCase } from '../../application/use-cases/listar-inventario.use-case';
import { ObtenerInventarioUseCase } from '../../application/use-cases/obtener-inventario.use-case';
import {
  InventarioCantidadInvalidaError,
  InventarioCasinoNotFoundError,
  InventarioCodigoAlreadyExistsError,
  InventarioNotFoundError,
  InventarioResponsableNotFoundError,
  InventarioSerialAlreadyExistsError,
  InventarioValorInvalidoError,
} from '../../errors/inventario.errors';
import { ActualizarInventarioDto } from '../dto/actualizar-inventario.dto';
import { CrearInventarioDto } from '../dto/crear-inventario.dto';
import { ListarInventarioQueryDto } from '../dto/listar-inventario-query.dto';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';

@Controller('inventario')
@UseGuards(JwtAuthGuard)
export class InventarioController {
  constructor(
    private readonly crearUseCase:
      CrearInventarioUseCase,
    private readonly listarUseCase:
      ListarInventarioUseCase,
    private readonly obtenerUseCase:
      ObtenerInventarioUseCase,
    private readonly actualizarUseCase:
      ActualizarInventarioUseCase,
    private readonly eliminarUseCase:
      EliminarInventarioUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CrearInventarioDto,
  ) {
    try {
      return await this.crearUseCase.execute(
        dto,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Get()
  findAll(
    @Query()
    query: ListarInventarioQueryDto,
  ) {
    return this.listarUseCase.execute(
      query,
    );
  }

  @Get(':idInventario')
  async findOne(
    @Param(
      'idInventario',
      ParseIntPipe,
    )
    idInventario: number,
  ) {
    try {
      return await this.obtenerUseCase.execute(
        idInventario,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Patch(':idInventario')
  async update(
    @Param(
      'idInventario',
      ParseIntPipe,
    )
    idInventario: number,

    @Body()
    dto: ActualizarInventarioDto,
  ) {
    try {
      return await this.actualizarUseCase.execute(
        idInventario,
        dto,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Delete(':idInventario')
  async remove(
    @Param(
      'idInventario',
      ParseIntPipe,
    )
    idInventario: number,
  ) {
    try {
      const item =
        await this.eliminarUseCase.execute(
          idInventario,
        );

      return {
        message:
          'Elemento de inventario inactivado correctamente.',
        data: item,
      };
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private handleError(
    error: unknown,
  ): never {
    if (
      error instanceof
      InventarioNotFoundError
    ) {
      throw new NotFoundException(
        error.message,
      );
    }

    if (
      error instanceof
        InventarioCodigoAlreadyExistsError ||
      error instanceof
        InventarioSerialAlreadyExistsError
    ) {
      throw new ConflictException(
        error.message,
      );
    }

    if (
      error instanceof
        InventarioCasinoNotFoundError ||
      error instanceof
        InventarioResponsableNotFoundError ||
      error instanceof
        InventarioCantidadInvalidaError ||
      error instanceof
        InventarioValorInvalidoError
    ) {
      throw new BadRequestException(
        error.message,
      );
    }

    throw error;
  }
}
