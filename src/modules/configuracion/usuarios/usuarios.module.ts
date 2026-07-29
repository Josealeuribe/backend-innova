import { Module } from '@nestjs/common';

import { AuthModule } from 'src/modules/auth/auth.module';

import { PasswordHasherService } from
  'src/modules/auth/application/ports/password-hasher.service';

import { PASSWORD_HASHER_SERVICE } from
  'src/modules/auth/auth.tokens';

import { CrearUsuarioUseCase } from
  './application/use-cases/crear-usuario.use-case';

import { ListarUsuariosUseCase } from
  './application/use-cases/listar-usuarios.use-case';

import { ObtenerUsuarioUseCase } from
  './application/use-cases/obtener-usuario.use-case';



import { ActualizarUsuarioUseCase } from
  './application/use-cases/actualizar-usuario.use-case';

import { EliminarUsuarioUseCase } from
  './application/use-cases/eliminar-usuario.use-case';

import type { UsuarioRepository } from
  './domain/repositories/usuario.repository';

import { PrismaUsuarioRepository } from
  './infrastructure/persistence/prisma-usuario.repository';

import { UsuariosController } from
  './presentation/controllers/usuarios.controller';

import { USUARIO_REPOSITORY } from
  './usuarios.tokens';
import { ObtenerCatalogosUsuarioUseCase } from './application/use-cases/obtener-catalogo.use-case';

@Module({
  imports: [
    AuthModule,
  ],

  controllers: [
    UsuariosController,
  ],

  providers: [
    {
      provide: USUARIO_REPOSITORY,
      useClass: PrismaUsuarioRepository,
    },

    // ==================================================
    // CREAR USUARIO
    // ==================================================

    {
      provide: CrearUsuarioUseCase,

      useFactory: (
        usuarioRepository: UsuarioRepository,
        passwordHasher: PasswordHasherService,
      ) => {
        return new CrearUsuarioUseCase(
          usuarioRepository,
          passwordHasher,
        );
      },

      inject: [
        USUARIO_REPOSITORY,
        PASSWORD_HASHER_SERVICE,
      ],
    },

    // ==================================================
    // LISTAR USUARIOS
    // ==================================================

    {
      provide: ListarUsuariosUseCase,

      useFactory: (
        usuarioRepository: UsuarioRepository,
      ) => {
        return new ListarUsuariosUseCase(
          usuarioRepository,
        );
      },

      inject: [
        USUARIO_REPOSITORY,
      ],
    },

    // ==================================================
    // OBTENER USUARIO
    // ==================================================

    {
      provide: ObtenerUsuarioUseCase,

      useFactory: (
        usuarioRepository: UsuarioRepository,
      ) => {
        return new ObtenerUsuarioUseCase(
          usuarioRepository,
        );
      },

      inject: [
        USUARIO_REPOSITORY,
      ],
    },

    // ==================================================
    // OBTENER CATÁLOGOS
    // ==================================================

    {
      provide: ObtenerCatalogosUsuarioUseCase,

      useFactory: (
        usuarioRepository: UsuarioRepository,
      ) => {
        return new ObtenerCatalogosUsuarioUseCase(
          usuarioRepository,
        );
      },

      inject: [
        USUARIO_REPOSITORY,
      ],
    },

    // ==================================================
    // ACTUALIZAR USUARIO
    // ==================================================

    {
      provide: ActualizarUsuarioUseCase,

      useFactory: (
        usuarioRepository: UsuarioRepository,
        passwordHasher: PasswordHasherService,
      ) => {
        return new ActualizarUsuarioUseCase(
          usuarioRepository,
          passwordHasher,
        );
      },

      inject: [
        USUARIO_REPOSITORY,
        PASSWORD_HASHER_SERVICE,
      ],
    },

    // ==================================================
    // ELIMINAR O DESACTIVAR USUARIO
    // ==================================================

    {
      provide: EliminarUsuarioUseCase,

      useFactory: (
        usuarioRepository: UsuarioRepository,
      ) => {
        return new EliminarUsuarioUseCase(
          usuarioRepository,
        );
      },

      inject: [
        USUARIO_REPOSITORY,
      ],
    },
  ],
})
export class UsuariosModule {}