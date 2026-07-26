export interface PasswordHasherService {
  hash(password: string): Promise<string>;

  compare(plainPassword: string, passwordHash: string): Promise<boolean>;
}
