export class RolNotFoundError extends Error {
  constructor(idRol: number) {
    super(`No existe un rol con el ID ${idRol}.`);
    this.name = 'RolNotFoundError';
  }
}

export class RolNombreAlreadyExistsError extends Error {
  constructor(nombreRol: string) {
    super(`Ya existe un rol con el nombre "${nombreRol}".`);
    this.name = 'RolNombreAlreadyExistsError';
  }
}

export class RolHasActiveUsersError extends Error {
  constructor(idRol: number, totalUsuarios: number) {
    super(
      `El rol ${idRol} no puede inactivarse porque tiene ${totalUsuarios} usuario(s) activo(s) asociado(s). Reasigna o inactiva esos usuarios primero.`,
    );
    this.name = 'RolHasActiveUsersError';
  }
}
