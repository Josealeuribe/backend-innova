export type EstadoCasino = 'ACTIVO' | 'INACTIVO';

export interface CasinoEntity {
  idCasino: number;
  nombreCasino: string;

  codigoDane: string;
  codigoEstablecimiento: string;

  telefono: string;
  direccion: string;

  estado: EstadoCasino;

  ciudad: {
    idCiudad: number;
    nombreCiudad: string;
  };

  centroCosto: {
    idCentroCosto: number;
    codigoCentroCosto: string;
    nombreCentroCosto: string;
  };

  razonSocial: {
    idRazonSocial: number;
    nit: string;
    nombreRazonSocial: string;
  };

  fechaCreacion: Date;
  fechaActualizacion: Date;
}