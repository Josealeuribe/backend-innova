import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './shared/database/prisma/prisma.module';
import { UsuariosModule } from './modules/configuracion/usuarios/usuarios.module';
import { CasinosModule } from './modules/configuracion/casinos/casinos.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
