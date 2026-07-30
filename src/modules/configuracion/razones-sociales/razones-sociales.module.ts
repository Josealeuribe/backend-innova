import { Module } from '@nestjs/common';
import { ActualizarRazonSocialUseCase } from './application/use-cases/actualizar-razon-social.use-case';
import { CrearRazonSocialUseCase } from './application/use-cases/crear-razon-social.use-case';
import { EliminarRazonSocialUseCase } from './application/use-cases/eliminar-razon-social.use-case';
import { ListarRazonesSocialesUseCase } from './application/use-cases/listar-razones-sociales.use-case';
import { ObtenerRazonSocialUseCase } from './application/use-cases/obtener-razon-social.use-case';
import { RAZON_SOCIAL_REPOSITORY } from './domain/repositories/razon-social.repository.token';
import { PrismaRazonSocialRepository } from './persistence/prisma/prisma-razon-social.repository';
import { RazonesSocialesController } from './presentation/controllers/razones-sociales.controller';

@Module({
  controllers: [RazonesSocialesController],
  providers: [
    { provide: RAZON_SOCIAL_REPOSITORY, useClass: PrismaRazonSocialRepository },
    CrearRazonSocialUseCase,
    ListarRazonesSocialesUseCase,
    ObtenerRazonSocialUseCase,
    ActualizarRazonSocialUseCase,
    EliminarRazonSocialUseCase,
  ],
  exports: [RAZON_SOCIAL_REPOSITORY],
})
export class RazonesSocialesModule {}
