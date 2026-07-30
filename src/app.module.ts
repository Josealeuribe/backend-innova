import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './shared/database/prisma/prisma.module';
import { UsuariosModule } from './modules/configuracion/usuarios/usuarios.module';
import { CasinosModule } from './modules/configuracion/casinos/casinos.module';
import { UbicacionesModule } from './modules/ubicaciones/ubicaciones.module';
import { CentrosCostosModule } from './modules/centros-costos/centros-costos.module';
import { RazonesSocialesModule } from './modules/configuracion/razones-sociales/razones-sociales.module';
import { RolesModule } from './modules/configuracion/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
    }),

    PrismaModule,
    AuthModule,
    UsuariosModule,
    CasinosModule,
    UbicacionesModule,
    CentrosCostosModule,
    RazonesSocialesModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
