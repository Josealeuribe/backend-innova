import { AuthUserRepository } from '../../domain/repositories/auth-user.repository';
import {
  InactiveAccountError,
  InvalidCredentialsError,
} from '../errors/auth.errors';
import { AccessTokenService } from '../ports/access-token.service';
import { PasswordHasherService } from '../ports/password-hasher.service';

export interface LoginCommand {
  correo: string;
  contrasena: string;
}

export interface LoginResult {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;

  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    estado: string;

    rol: {
      idRol: number;
      nombreRol: string;
    };
  };
}

export class LoginUseCase {
  constructor(
    private readonly usersRepository: AuthUserRepository,
    private readonly passwordHasher: PasswordHasherService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const correo = command.correo.trim().toLowerCase();

    const usuario = await this.usersRepository.findByEmail(correo);

    if (!usuario) {
      throw new InvalidCredentialsError();
    }

    const passwordIsValid = await this.passwordHasher.compare(
      command.contrasena,
      usuario.passwordHash,
    );

    if (!passwordIsValid) {
      throw new InvalidCredentialsError();
    }

    if (usuario.estado !== 'ACTIVO' || usuario.rol.estado !== 'ACTIVO') {
      throw new InactiveAccountError();
    }

    const accessToken = await this.accessTokenService.sign({
      sub: usuario.id,
      correo: usuario.correo,
      idRol: usuario.rol.idRol,
      rol: usuario.rol.nombreRol,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.accessTokenService.expiresInSeconds,

      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        estado: usuario.estado,

        rol: {
          idRol: usuario.rol.idRol,
          nombreRol: usuario.rol.nombreRol,
        },
      },
    };
  }
}
