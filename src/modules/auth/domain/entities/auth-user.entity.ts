export type EstadoCuenta = 'ACTIVO' | 'INACTIVO';

export interface AuthUser {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  passwordHash: string;
  estado: EstadoCuenta;

  rol: {
    idRol: number;
    nombreRol: string;
    estado: EstadoCuenta;
  };
}
