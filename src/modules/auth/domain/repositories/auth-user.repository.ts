import { AuthUser } from '../entities/auth-user.entity';

export interface AuthUserRepository {
  findByEmail(correo: string): Promise<AuthUser | null>;
}
