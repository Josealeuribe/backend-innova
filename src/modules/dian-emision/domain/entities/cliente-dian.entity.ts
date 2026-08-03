export interface ClienteDianEntity {
  idClienteDian: number;
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
  direccion: string | null;
  ciudad: string | null;
  departamento: string | null;
  telefono: string | null;
  email: string | null;
  tipoPersona: string;
  responsabilidadFiscal: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
