export class UsuarioNotFoundError extends Error {
  constructor() {
    super('El usuario no existe.');
    this.name = 'UsuarioNotFoundError';
  }
}

export class UsuarioCorreoAlreadyExistsError extends Error {
  constructor() {
    super('Ya existe un usuario registrado con ese correo.');
    this.name = 'UsuarioCorreoAlreadyExistsError';
  }
}

export class UsuarioCedulaAlreadyExistsError extends Error {
  constructor() {
    super('Ya existe un usuario registrado con esa cédula.');
    this.name = 'UsuarioCedulaAlreadyExistsError';
  }
}

export class UsuarioForeignKeyError extends Error {
  constructor(
    public readonly relacionesFaltantes: string[],
  ) {
    super(
      `No existen las siguientes relaciones: ${relacionesFaltantes.join(', ')}.`,
    );

    this.name = 'UsuarioForeignKeyError';
  }
}