import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from
  'src/modules/auth/presentation/guards/jwt-auth.guard';

import { ListarCiudadesUseCase } from
  '../../application/use-cases/listar-ciudades.use-case';

import { ListarCiudadesQueryDto } from
  '../dto/listar-ciudades-query.dto';

@Controller('ciudades')
@UseGuards(JwtAuthGuard)
export class CiudadesController {
  constructor(
    private readonly listarCiudades:
      ListarCiudadesUseCase,
  ) {}

  @Get()
  findAll(
    @Query()
    query: ListarCiudadesQueryDto,
  ) {
    return this.listarCiudades.execute({
      idPais: query.idPais,
      idDepartamento:
        query.idDepartamento,
      estado: query.estado,
      buscar: query.buscar,
    });
  }
}