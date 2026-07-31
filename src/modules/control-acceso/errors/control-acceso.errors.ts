export type ControlAccesoErrorCode =
  | 'NOT_FOUND'
  | 'DUPLICATE'
  | 'INVALID_RELATION'
  | 'ACTIVE_DEPENDENCIES'
  | 'INVALID_PARENT';

export class ControlAccesoError extends Error {
  constructor(
    public readonly code: ControlAccesoErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ControlAccesoError';
  }
}

export class ControlAccesoNotFoundError extends ControlAccesoError {
  constructor(entity: string, id: number) {
    super('NOT_FOUND', `No existe ${entity} con el ID ${id}.`);
  }
}

export class ControlAccesoDuplicateError extends ControlAccesoError {
  constructor(message: string) {
    super('DUPLICATE', message);
  }
}

export class ControlAccesoInvalidRelationError extends ControlAccesoError {
  constructor(message: string) {
    super('INVALID_RELATION', message);
  }
}

export class ControlAccesoActiveDependenciesError extends ControlAccesoError {
  constructor(message: string) {
    super('ACTIVE_DEPENDENCIES', message);
  }
}

export class ControlAccesoInvalidParentError extends ControlAccesoError {
  constructor(message: string) {
    super('INVALID_PARENT', message);
  }
}
