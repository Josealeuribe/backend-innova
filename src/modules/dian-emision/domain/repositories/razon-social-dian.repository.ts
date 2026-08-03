import { RazonSocialDianEntity } from '../entities/razon-social-dian.entity';

export interface RazonSocialDianRepository {
  findById(idRazonSocial: number): Promise<RazonSocialDianEntity | null>;
}
