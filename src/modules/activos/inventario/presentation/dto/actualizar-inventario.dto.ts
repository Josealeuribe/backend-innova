import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';

import { EstadoRegistro } from 'src/generated/prisma/client';

import { CrearInventarioDto } from './crear-inventario.dto';

export class ActualizarInventarioDto
  extends PartialType(
    CrearInventarioDto,
  )
{
  @IsOptional()
  @IsEnum(EstadoRegistro)
  estadoRegistro?: EstadoRegistro;
}
