import { EstadoCentroCosto } from "../../domain/entities/centro-costo.entity";

export interface CrearCentroCostoCommand {
  codigoCentroCosto: string;
  nombreCentroCosto: string;
  estado?: EstadoCentroCosto;
}