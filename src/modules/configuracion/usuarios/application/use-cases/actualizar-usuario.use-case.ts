
import { PasswordHasherService } from 'src/modules/auth/application/ports/password-hasher.service';
import { EstadoUsuario } from '../../domain/entities/usuario.entity';
import {
  UsuarioForeignKeys,
  UsuarioRepository,
} from '../../domain/repositories/usuario.repository';
import {
  UsuarioCedulaAlreadyExistsError,
  UsuarioCorreoAlreadyExistsError,
  UsuarioForeignKeyError,
  UsuarioNotFoundError,
} from '../errors/usuario.errors';

export interface ActualizarUsuarioCommand {
  nombre?: string;
  apellido?: string;
  cedula?: string;
  correo?: string;
  contrasena?: string;

  cargo?: string;
  fechaNacimiento?: string;
  telefono?: string;

  codigoHelisa?: string | null;
  cuentaPuc?: string | null;
  imgUrl?: string | null;

  estado?: EstadoUsuario;

  idTipoDoc?: number;
  idGenero?: number;
  idRol?: number;
  idCiudad?: number;
  idCasino?: number;
}

export class ActualizarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly passwordHasher: PasswordHasherService,
  ) {}

  async execute(
    id: number,
    command: ActualizarUsuarioCommand,
  ) {
    const usuarioActual =
      await this.usuarioRepository.findById(id);

    if (!usuarioActual) {
      throw new UsuarioNotFoundError();
    }

    const correo = command.correo
      ?.trim()
      .toLowerCase();

    if (correo) {
      const usuarioConCorreo =
        await this.usuarioRepository.findIdByCorreo(correo);

      if (
        usuarioConCorreo !== null &&
        usuarioConCorreo !== id
      ) {
        throw new UsuarioCorreoAlreadyExistsError();
      }
    }

    const cedula = command.cedula?.trim();

    if (cedula) {
      const usuarioConCedula =
        await this.usuarioRepository.findIdByCedula(cedula);

      if (
        usuarioConCedula !== null &&
        usuarioConCedula !== id
      ) {
        throw new UsuarioCedulaAlreadyExistsError();
      }
    }

    const foreignKeys: UsuarioForeignKeys = {
      idTipoDoc:
        command.idTipoDoc ??
        usuarioActual.tipoDocumento.idTipoDoc,

      idGenero:
        command.idGenero ??
        usuarioActual.genero.idGenero,

      idRol:
        command.idRol ??
        usuarioActual.rol.idRol,

      idCiudad:
        command.idCiudad ??
        usuarioActual.ciudad.idCiudad,

      idCasino:
        command.idCasino ??
        usuarioActual.casino.idCasino,
    };

    await this.validateForeignKeys(foreignKeys);

    const passwordHash = command.contrasena
      ? await this.passwordHasher.hash(command.contrasena)
      : undefined;

    return this.usuarioRepository.update(id, {
      nombre: command.nombre?.trim(),
      apellido: command.apellido?.trim(),
      cedula,
      correo,
      passwordHash,

      cargo: command.cargo?.trim(),

      fechaNacimiento: command.fechaNacimiento
        ? new Date(command.fechaNacimiento)
        : undefined,

      telefono: command.telefono?.trim(),

      codigoHelisa:
        command.codigoHelisa === undefined
          ? undefined
          : command.codigoHelisa?.trim() || null,

      cuentaPuc:
        command.cuentaPuc === undefined
          ? undefined
          : command.cuentaPuc?.trim() || null,

      imgUrl:
        command.imgUrl === undefined
          ? undefined
          : command.imgUrl?.trim() || null,

      estado: command.estado,

      idTipoDoc: command.idTipoDoc,
      idGenero: command.idGenero,
      idRol: command.idRol,
      idCiudad: command.idCiudad,
      idCasino: command.idCasino,
    });
  }

  private async validateForeignKeys(
    foreignKeys: UsuarioForeignKeys,
  ): Promise<void> {
    const result =
      await this.usuarioRepository.checkForeignKeys(foreignKeys);

    const missing: string[] = [];

    if (!result.rol) missing.push('rol');
    if (!result.genero) missing.push('género');
    if (!result.tipoDocumento) {
      missing.push('tipo de documento');
    }
    if (!result.ciudad) missing.push('ciudad');
    if (!result.casino) missing.push('casino');

    if (missing.length > 0) {
      throw new UsuarioForeignKeyError(missing);
    }
  }
}