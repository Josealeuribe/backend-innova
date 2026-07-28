import { Module } from '@nestjs/common';



import type { UsuarioRepository } from './domain/repositories/usuario.repository';

import { ActualizarUsuarioUseCase } from './application/use-cases/actualizar-usuario.use-case';
import { CrearUsuarioUseCase } from './application/use-cases/crear-usuario.use-case';
import { EliminarUsuarioUseCase } from './application/use-cases/eliminar-usuario.use-case';
import { ListarUsuariosUseCase } from './application/use-cases/listar-usuarios.use-case';
import { ObtenerUsuarioUseCase } from './application/use-cases/obtener-usuario.use-case';

import { PrismaUsuarioRepository } from './infrastructure/persistence/prisma-usuario.repository';
import { UsuariosController } from './presentation/controllers/usuarios.controller';
import { USUARIO_REPOSITORY } from './usuarios.tokens';
import { PasswordHasherService } from 'src/modules/auth/application/ports/password-hasher.service';
import { PASSWORD_HASHER_SERVICE } from 'src/modules/auth/auth.tokens';
import { AuthModule } from 'src/modules/auth/auth.module';

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

    {
      provide: CrearUsuarioUseCase,

      useFactory: (
        usuarioRepository: UsuarioRepository,
        passwordHasher: PasswordHasherService,
      ) =>
        new CrearUsuarioUseCase(
          usuarioRepository,
          passwordHasher,
        ),

      inject: [
        USUARIO_REPOSITORY,
        PASSWORD_HASHER_SERVICE,
      ],
    },

    {
      provide: ListarUsuariosUseCase,

      useFactory: (
        usuarioRepository: UsuarioRepository,
      ) =>
        new ListarUsuariosUseCase(
          usuarioRepository,
        ),

      inject: [
        USUARIO_REPOSITORY,
      ],
    },

    {
      provide: ObtenerUsuarioUseCase,

      useFactory: (
        usuarioRepository: UsuarioRepository,
      ) =>
        new ObtenerUsuarioUseCase(
          usuarioRepository,
        ),

      inject: [
        USUARIO_REPOSITORY,
      ],
    },

    {
      provide: ActualizarUsuarioUseCase,

      useFactory: (
        usuarioRepository: UsuarioRepository,
        passwordHasher: PasswordHasherService,
      ) =>
        new ActualizarUsuarioUseCase(
          usuarioRepository,
          passwordHasher,
        ),

      inject: [
        USUARIO_REPOSITORY,
        PASSWORD_HASHER_SERVICE,
      ],
    },

    {
      provide: EliminarUsuarioUseCase,

      useFactory: (
        usuarioRepository: UsuarioRepository,
      ) =>
        new EliminarUsuarioUseCase(
          usuarioRepository,
        ),

      inject: [
        USUARIO_REPOSITORY,
      ],
    },
  ],
})
export class UsuariosModule {}