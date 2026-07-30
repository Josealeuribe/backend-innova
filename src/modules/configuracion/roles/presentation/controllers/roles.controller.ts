import {
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



import { ActualizarRolUseCase } from '../../application/use-cases/actualizar-rol.use-case';
import { CrearRolUseCase } from '../../application/use-cases/crear-rol.use-case';
import { EliminarRolUseCase } from '../../application/use-cases/eliminar-rol.use-case';
import { ListarRolesUseCase } from '../../application/use-cases/listar-roles.use-case';
import { ObtenerRolUseCase } from '../../application/use-cases/obtener-rol.use-case';
import {
  RolHasActiveUsersError,
  RolNombreAlreadyExistsError,
  RolNotFoundError,
} from '../../errors/rol.errors';
import { ActualizarRolDto } from '../dto/actualizar-rol.dto';
import { CrearRolDto } from '../dto/crear-rol.dto';
import { ListarRolesQueryDto } from '../dto/listar-roles-query.dto';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(
    private readonly crearUseCase: CrearRolUseCase,
    private readonly listarUseCase: ListarRolesUseCase,
    private readonly obtenerUseCase: ObtenerRolUseCase,
    private readonly actualizarUseCase: ActualizarRolUseCase,
    private readonly eliminarUseCase: EliminarRolUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CrearRolDto) {
    try {
      return await this.crearUseCase.execute(dto);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Get()
  findAll(@Query() query: ListarRolesQueryDto) {
    return this.listarUseCase.execute(query);
  }

  @Get(':idRol')
  async findOne(
    @Param('idRol', ParseIntPipe) idRol: number,
  ) {
    try {
      return await this.obtenerUseCase.execute(idRol);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Patch(':idRol')
  async update(
    @Param('idRol', ParseIntPipe) idRol: number,
    @Body() dto: ActualizarRolDto,
  ) {
    try {
      return await this.actualizarUseCase.execute(idRol, dto);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Delete(':idRol')
  async remove(
    @Param('idRol', ParseIntPipe) idRol: number,
  ) {
    try {
      const rol = await this.eliminarUseCase.execute(idRol);

      return {
        message: 'Rol inactivado correctamente.',
        data: rol,
      };
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof RolNotFoundError) {
      throw new NotFoundException(error.message);
    }

    if (
      error instanceof RolNombreAlreadyExistsError ||
      error instanceof RolHasActiveUsersError
    ) {
      throw new ConflictException(error.message);
    }

    throw error;
  }
}
