import { EstadoCentroCosto } from "../../domain/entities/centro-costo.entity";

export interface ActualizarCentroCostoCommand {
  codigoCentroCosto?: string;
  nombreCentroCosto?: string;
  estado?: EstadoCentroCosto;
}
