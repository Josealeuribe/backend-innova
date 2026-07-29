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

import { JwtAuthGuard } from
  'src/modules/auth/presentation/guards/jwt-auth.guard';

import {
  UsuarioCedulaAlreadyExistsError,
  UsuarioCorreoAlreadyExistsError,
  UsuarioForeignKeyError,
  UsuarioNotFoundError,
} from '../../application/errors/usuario.errors';

import { ActualizarUsuarioUseCase } from
  '../../application/use-cases/actualizar-usuario.use-case';

import { CrearUsuarioUseCase } from
  '../../application/use-cases/crear-usuario.use-case';

import { EliminarUsuarioUseCase } from
  '../../application/use-cases/eliminar-usuario.use-case';

import { ListarUsuariosUseCase } from
  '../../application/use-cases/listar-usuarios.use-case';



import { ObtenerUsuarioUseCase } from
  '../../application/use-cases/obtener-usuario.use-case';

import { ActualizarUsuarioDto } from
  '../dto/actualizar-usuario.dto';

import { CrearUsuarioDto } from
  '../dto/crear-usuario.dto';

import { ListarUsuariosQueryDto } from
  '../dto/listar-usuarios-query.dto';
import { ObtenerCatalogosUsuarioUseCase } from '../../application/use-cases/obtener-catalogo.use-case';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(
    private readonly crearUsuarioUseCase:
      CrearUsuarioUseCase,

    private readonly listarUsuariosUseCase:
      ListarUsuariosUseCase,

    private readonly obtenerUsuarioUseCase:
      ObtenerUsuarioUseCase,

    private readonly obtenerCatalogosUsuarioUseCase:
      ObtenerCatalogosUsuarioUseCase,

    private readonly actualizarUsuarioUseCase:
      ActualizarUsuarioUseCase,

    private readonly eliminarUsuarioUseCase:
      EliminarUsuarioUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CrearUsuarioDto,
  ) {
    try {
      return await this.crearUsuarioUseCase.execute(
        dto,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Get()
  async findAll(
    @Query() query: ListarUsuariosQueryDto,
  ) {
    return this.listarUsuariosUseCase.execute({
      page: query.page,
      limit: query.limit,
      buscar: query.buscar,
      estado: query.estado,

      idRol: query.idRol,
      idGenero: query.idGenero,
      idTipoDoc: query.idTipoDoc,
      idCiudad: query.idCiudad,
      idCasino: query.idCasino,
    });
  }

  // Debe estar antes de @Get(':id')
  @Get('catalogos')
  getCatalogos() {
    return this.obtenerCatalogosUsuarioUseCase.execute();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    try {
      return await this.obtenerUsuarioUseCase.execute(
        id,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: ActualizarUsuarioDto,
  ) {
    try {
      return await this.actualizarUsuarioUseCase.execute(
        id,
        dto,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    try {
      const usuario =
        await this.eliminarUsuarioUseCase.execute(
          id,
        );

      return {
        message:
          'Usuario desactivado correctamente.',
        usuario,
      };
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private handleError(
    error: unknown,
  ): never {
    if (
      error instanceof UsuarioNotFoundError
    ) {
      throw new NotFoundException(
        error.message,
      );
    }

    if (
      error instanceof
        UsuarioCorreoAlreadyExistsError ||
      error instanceof
        UsuarioCedulaAlreadyExistsError
    ) {
      throw new ConflictException(
        error.message,
      );
    }

    if (
      error instanceof UsuarioForeignKeyError
    ) {
      throw new BadRequestException({
        message: error.message,
        relacionesFaltantes:
          error.relacionesFaltantes,
      });
    }

    throw error;
  }
}