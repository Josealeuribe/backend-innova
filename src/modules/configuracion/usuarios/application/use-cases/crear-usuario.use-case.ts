
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
} from '../errors/usuario.errors';

export interface CrearUsuarioCommand extends UsuarioForeignKeys {
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  contrasena: string;

  cargo: string;
  fechaNacimiento: string;
  telefono: string;

  codigoHelisa?: string | null;
  cuentaPuc?: string | null;
  imgUrl?: string | null;

  estado?: EstadoUsuario;
}

export class CrearUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly passwordHasher: PasswordHasherService,
  ) {}

  async execute(command: CrearUsuarioCommand) {
    const correo = command.correo.trim().toLowerCase();
    const cedula = command.cedula.trim();

    const usuarioCorreo =
      await this.usuarioRepository.findIdByCorreo(correo);

    if (usuarioCorreo !== null) {
      throw new UsuarioCorreoAlreadyExistsError();
    }

    const usuarioCedula =
      await this.usuarioRepository.findIdByCedula(cedula);

    if (usuarioCedula !== null) {
      throw new UsuarioCedulaAlreadyExistsError();
    }

    await this.validateForeignKeys(command);

    const passwordHash = await this.passwordHasher.hash(
      command.contrasena,
    );

    return this.usuarioRepository.create({
      nombre: command.nombre.trim(),
      apellido: command.apellido.trim(),
      cedula,
      correo,
      passwordHash,

      cargo: command.cargo.trim(),
      fechaNacimiento: new Date(command.fechaNacimiento),
      telefono: command.telefono.trim(),

      codigoHelisa: command.codigoHelisa?.trim() || null,
      cuentaPuc: command.cuentaPuc?.trim() || null,
      imgUrl: command.imgUrl?.trim() || null,

      estado: command.estado ?? 'ACTIVO',

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