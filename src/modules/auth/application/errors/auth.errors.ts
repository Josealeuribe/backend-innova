export class InvalidCredentialsError extends Error {
  constructor() {
    super('Credenciales incorrectas.');
    this.name = 'InvalidCredentialsError';
  }
}

export class InactiveAccountError extends Error {
  constructor() {
    super('La cuenta no está activa.');
    this.name = 'InactiveAccountError';
  }
}
