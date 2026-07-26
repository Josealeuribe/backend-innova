export interface AccessTokenPayload {
  sub: number;
  correo: string;
  idRol: number;
  rol: string;
}

export interface AccessTokenService {
  readonly expiresInSeconds: number;

  sign(payload: AccessTokenPayload): Promise<string>;

  verify(token: string): Promise<AccessTokenPayload>;
}
