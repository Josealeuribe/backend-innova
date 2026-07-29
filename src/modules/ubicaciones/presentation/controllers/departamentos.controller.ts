import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from
  'src/modules/auth/presentation/guards/jwt-auth.guard';

import { ListarDepartamentosUseCase } from
  '../../application/use-cases/listar-departamentos.use-case';

import { ListarDepartamentosQueryDto } from
  '../dto/listar-departamentos-query.dto';

@Controller('departamentos')
@UseGuards(JwtAuthGuard)
export class DepartamentosController {
  constructor(
    private readonly listarDepartamentosUseCase:
      ListarDepartamentosUseCase,
  ) {}

  @Get()
  findAll(
    @Query()
    query:
      ListarDepartamentosQueryDto,
  ) {
    return this
      .listarDepartamentosUseCase
      .execute({
        idPais: query.idPais,
        buscar: query.buscar,
      });
  }
}