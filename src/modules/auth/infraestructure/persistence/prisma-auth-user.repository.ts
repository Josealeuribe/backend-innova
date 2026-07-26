import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { AuthUser } from '../../domain/entities/auth-user.entity';
import { AuthUserRepository } from '../../domain/repositories/auth-user.repository';

@Injectable()
export class PrismaAuthUserRepository implements AuthUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(correo: string): Promise<AuthUser | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        correo,
      },

      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        passwordHash: true,
        estado: true,

        rol: {
          select: {
            idRol: true,
            nombreRol: true,
            estado: true,
          },
        },
      },
    });

    if (!usuario) {
      return null;
    }

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      passwordHash: usuario.passwordHash,
      estado: usuario.estado,

      rol: {
        idRol: usuario.rol.idRol,
        nombreRol: usuario.rol.nombreRol,
        estado: usuario.rol.estado,
      },
    };
  }
}
