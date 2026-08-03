import { Module } from '@nestjs/common';

import { AuthModule } from 'src/modules/auth/auth.module';

import {
  CLIENTE_DIAN_REPOSITORY,
  FACTURA_ELECTRONICA_REPOSITORY,
  RAZON_SOCIAL_DIAN_REPOSITORY,
  RESOLUCION_DIAN_REPOSITORY,
} from './dian-emision.tokens';

import { ClienteDianRepository } from './domain/repositories/cliente-dian.repository';
import { FacturaElectronicaRepository } from './domain/repositories/factura-electronica.repository';
import { RazonSocialDianRepository } from './domain/repositories/razon-social-dian.repository';
import { ResolucionDianRepository } from './domain/repositories/resolucion-dian.repository';

import { PrismaClienteDianRepository } from './infraestructure/persistence/prisma-cliente-dian.repository';
import { PrismaFacturaElectronicaRepository } from './infraestructure/persistence/prisma-factura-electronica.repository';
import { PrismaRazonSocialDianRepository } from './infraestructure/persistence/prisma-razon-social-dian.repository';
import { PrismaResolucionDianRepository } from './infraestructure/persistence/prisma-resolucion-dian.repository';

import { CufeCalculatorService } from './application/services/cufe-calculator.service';
import { FacturaElectronicaCalculoService } from './application/services/factura-electronica-calculo.service';
import { SoftwareSecurityCodeService } from './application/services/software-security-code.service';
import { UblXmlBuilderService } from './application/services/ubl-xml-builder.service';

import { ActualizarClienteDianUseCase } from './application/use-cases/clientes/actualizar-cliente-dian.use-case';
import { CrearClienteDianUseCase } from './application/use-cases/clientes/crear-cliente-dian.use-case';
import { ListarClientesDianUseCase } from './application/use-cases/clientes/listar-clientes-dian.use-case';
import { ObtenerClienteDianUseCase } from './application/use-cases/clientes/obtener-cliente-dian.use-case';

import { CrearFacturaElectronicaUseCase } from './application/use-cases/facturas/crear-factura-electronica.use-case';
import { ListarFacturasElectronicasUseCase } from './application/use-cases/facturas/listar-facturas-electronicas.use-case';
import { ObtenerFacturaElectronicaUseCase } from './application/use-cases/facturas/obtener-factura-electronica.use-case';
import { ObtenerResumenDianUseCase } from './application/use-cases/facturas/obtener-resumen-dian.use-case';
import { ObtenerXmlFacturaElectronicaUseCase } from './application/use-cases/facturas/obtener-xml-factura-electronica.use-case';

import { ActualizarResolucionDianUseCase } from './application/use-cases/resoluciones/actualizar-resolucion-dian.use-case';
import { CambiarEstadoResolucionDianUseCase } from './application/use-cases/resoluciones/cambiar-estado-resolucion-dian.use-case';
import { CrearResolucionDianUseCase } from './application/use-cases/resoluciones/crear-resolucion-dian.use-case';
import { ListarResolucionesDianUseCase } from './application/use-cases/resoluciones/listar-resoluciones-dian.use-case';
import { ObtenerResolucionDianUseCase } from './application/use-cases/resoluciones/obtener-resolucion-dian.use-case';

import { ClientesDianController } from './presentation/controllers/clientes-dian.controller';
import { FacturasDianController } from './presentation/controllers/facturas-dian.controller';
import { ResolucionesDianController } from './presentation/controllers/resoluciones-dian.controller';

@Module({
  imports: [AuthModule],

  controllers: [
    ResolucionesDianController,
    ClientesDianController,
    FacturasDianController,
  ],

  providers: [
    CufeCalculatorService,
    SoftwareSecurityCodeService,
    UblXmlBuilderService,
    FacturaElectronicaCalculoService,

    { provide: RESOLUCION_DIAN_REPOSITORY, useClass: PrismaResolucionDianRepository },
    { provide: CLIENTE_DIAN_REPOSITORY, useClass: PrismaClienteDianRepository },
    { provide: FACTURA_ELECTRONICA_REPOSITORY, useClass: PrismaFacturaElectronicaRepository },
    { provide: RAZON_SOCIAL_DIAN_REPOSITORY, useClass: PrismaRazonSocialDianRepository },

    {
      provide: CrearResolucionDianUseCase,
      useFactory: (repository: ResolucionDianRepository) =>
        new CrearResolucionDianUseCase(repository),
      inject: [RESOLUCION_DIAN_REPOSITORY],
    },
    {
      provide: ListarResolucionesDianUseCase,
      useFactory: (repository: ResolucionDianRepository) =>
        new ListarResolucionesDianUseCase(repository),
      inject: [RESOLUCION_DIAN_REPOSITORY],
    },
    {
      provide: ObtenerResolucionDianUseCase,
      useFactory: (repository: ResolucionDianRepository) =>
        new ObtenerResolucionDianUseCase(repository),
      inject: [RESOLUCION_DIAN_REPOSITORY],
    },
    {
      provide: ActualizarResolucionDianUseCase,
      useFactory: (repository: ResolucionDianRepository) =>
        new ActualizarResolucionDianUseCase(repository),
      inject: [RESOLUCION_DIAN_REPOSITORY],
    },
    {
      provide: CambiarEstadoResolucionDianUseCase,
      useFactory: (repository: ResolucionDianRepository) =>
        new CambiarEstadoResolucionDianUseCase(repository),
      inject: [RESOLUCION_DIAN_REPOSITORY],
    },

    {
      provide: CrearClienteDianUseCase,
      useFactory: (repository: ClienteDianRepository) =>
        new CrearClienteDianUseCase(repository),
      inject: [CLIENTE_DIAN_REPOSITORY],
    },
    {
      provide: ListarClientesDianUseCase,
      useFactory: (repository: ClienteDianRepository) =>
        new ListarClientesDianUseCase(repository),
      inject: [CLIENTE_DIAN_REPOSITORY],
    },
    {
      provide: ObtenerClienteDianUseCase,
      useFactory: (repository: ClienteDianRepository) =>
        new ObtenerClienteDianUseCase(repository),
      inject: [CLIENTE_DIAN_REPOSITORY],
    },
    {
      provide: ActualizarClienteDianUseCase,
      useFactory: (repository: ClienteDianRepository) =>
        new ActualizarClienteDianUseCase(repository),
      inject: [CLIENTE_DIAN_REPOSITORY],
    },

    {
      provide: CrearFacturaElectronicaUseCase,
      useFactory: (
        facturaRepository: FacturaElectronicaRepository,
        clienteRepository: ClienteDianRepository,
        razonSocialRepository: RazonSocialDianRepository,
        calculoService: FacturaElectronicaCalculoService,
        cufeCalculatorService: CufeCalculatorService,
        softwareSecurityCodeService: SoftwareSecurityCodeService,
        ublXmlBuilderService: UblXmlBuilderService,
      ) =>
        new CrearFacturaElectronicaUseCase(
          facturaRepository,
          clienteRepository,
          razonSocialRepository,
          calculoService,
          cufeCalculatorService,
          softwareSecurityCodeService,
          ublXmlBuilderService,
        ),
      inject: [
        FACTURA_ELECTRONICA_REPOSITORY,
        CLIENTE_DIAN_REPOSITORY,
        RAZON_SOCIAL_DIAN_REPOSITORY,
        FacturaElectronicaCalculoService,
        CufeCalculatorService,
        SoftwareSecurityCodeService,
        UblXmlBuilderService,
      ],
    },
    {
      provide: ListarFacturasElectronicasUseCase,
      useFactory: (repository: FacturaElectronicaRepository) =>
        new ListarFacturasElectronicasUseCase(repository),
      inject: [FACTURA_ELECTRONICA_REPOSITORY],
    },
    {
      provide: ObtenerFacturaElectronicaUseCase,
      useFactory: (repository: FacturaElectronicaRepository) =>
        new ObtenerFacturaElectronicaUseCase(repository),
      inject: [FACTURA_ELECTRONICA_REPOSITORY],
    },
    {
      provide: ObtenerXmlFacturaElectronicaUseCase,
      useFactory: (repository: FacturaElectronicaRepository) =>
        new ObtenerXmlFacturaElectronicaUseCase(repository),
      inject: [FACTURA_ELECTRONICA_REPOSITORY],
    },
    {
      provide: ObtenerResumenDianUseCase,
      useFactory: (repository: FacturaElectronicaRepository) =>
        new ObtenerResumenDianUseCase(repository),
      inject: [FACTURA_ELECTRONICA_REPOSITORY],
    },
  ],
})
export class DianEmisionModule {}
