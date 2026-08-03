/**
 * Recorte de los campos de `RazonSocial` que necesita el módulo DIAN
 * (CUFE, código de seguridad del software, datos del emisor en el XML).
 */
export interface RazonSocialDianEntity {
  idRazonSocial: number;
  nit: string;
  nombreRazonSocial: string;
  direccion: string;
  codigoPostal: string | null;
  telefono: string;
  correo: string;
  ciudad: string;
  departamento: string;
  pais: string;
  tipoPersonaCodigo: string;
  responsabilidadFiscal: string;
  softwareId: string | null;
  softwarePin: string | null;
  claveTecnica: string | null;
}
