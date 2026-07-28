export type EstadoUsuario = 'ACTIVO' | 'INACTIVO';

export interface UsuarioEntity {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;

  cargo: string;
  fechaNacimiento: Date;
  telefono: string;

  codigoHelisa: string | null;
  cuentaPuc: string | null;
  imgUrl: string | null;

  estado: EstadoUsuario;

  tipoDocumento: {
    idTipoDoc: number;
    nombreDoc: string;
  };

  genero: {
    idGenero: number;
    nombreGenero: string;
  };

  rol: {
    idRol: number;
    nombreRol: string;
  };

  ciudad: {
    idCiudad: number;
    nombreCiudad: string;
  };

  casino: {
    idCasino: number;
    nombreCasino: string;
  };

  fechaCreacion: Date;
  fechaActualizacion: Date;
}