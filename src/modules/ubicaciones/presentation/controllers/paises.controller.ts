import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from
  'src/modules/auth/presentation/guards/jwt-auth.guard';

import { ListarPaisesUseCase } from
  '../../application/use-cases/listar-paises.use-case';

import { ListarPaisesQueryDto } from
  '../dto/listar-paises-query.dto';

@Controller('paises')
@UseGuards(JwtAuthGuard)
export class PaisesController {
  constructor(
    private readonly listarPaisesUseCase:
      ListarPaisesUseCase,
  ) {}

  @Get()
  findAll(
    @Query()
    query: ListarPaisesQueryDto,
  ) {
    return this.listarPaisesUseCase
      .execute({
        buscar: query.buscar,
      });
  }
}