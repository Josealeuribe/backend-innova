import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';
import { EstadoRegistro, PrismaClient } from '../src/generated/prisma/client';

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`La variable de entorno ${name} no está configurada.`);
  }

  return value;
}

const databaseUrl = new URL(requiredEnv('DATABASE_URL'));

const databaseName = decodeURIComponent(
  databaseUrl.pathname.replace(/^\//, ''),
);

const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port || 3306),
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseName,
  connectionLimit: 5,
});

const prisma = new PrismaClient({
  adapter,
});

async function createRoles() {
  const roles = [
    {
      nombreRol: 'ADMINISTRADOR',
      descripcion: 'Acceso completo a la plataforma.',
    },
    {
      nombreRol: 'CONTADOR',
      descripcion: 'Gestión contable y financiera.',
    },
    {
      nombreRol: 'AUXILIAR_CONTABLE',
      descripcion: 'Apoyo en procesos contables.',
    },
    {
      nombreRol: 'CONSULTA',
      descripcion: 'Acceso de solo lectura.',
    },
  ];

  for (const rol of roles) {
    await prisma.rol.upsert({
      where: {
        nombreRol: rol.nombreRol,
      },
      update: {
        descripcion: rol.descripcion,
        estado: EstadoRegistro.ACTIVO,
      },
      create: {
        ...rol,
        estado: EstadoRegistro.ACTIVO,
      },
    });
  }
}

async function createDocumentTypes() {
  const documentTypes = ['CC', 'CE', 'PASAPORTE', 'PPT', 'NIT'];

  for (const nombreDoc of documentTypes) {
    await prisma.tipoDocumento.upsert({
      where: {
        nombreDoc,
      },
      update: {},
      create: {
        nombreDoc,
      },
    });
  }
}

async function createGenders() {
  const genders = ['MASCULINO', 'FEMENINO', 'NO ESPECIFICADO'];

  for (const nombreGenero of genders) {
    await prisma.genero.upsert({
      where: {
        nombreGenero,
      },
      update: {},
      create: {
        nombreGenero,
      },
    });
  }
}

async function createUsers() {
  const adminRole = await prisma.rol.findUniqueOrThrow({
    where: {
      nombreRol: 'ADMINISTRADOR',
    },
  });

  const accountantRole = await prisma.rol.findUniqueOrThrow({
    where: {
      nombreRol: 'CONTADOR',
    },
  });

  const cc = await prisma.tipoDocumento.findUniqueOrThrow({
    where: {
      nombreDoc: 'CC',
    },
  });

  const unspecifiedGender = await prisma.genero.findUniqueOrThrow({
    where: {
      nombreGenero: 'NO ESPECIFICADO',
    },
  });

  const maleGender = await prisma.genero.findUniqueOrThrow({
    where: {
      nombreGenero: 'MASCULINO',
    },
  });

  const adminEmail = requiredEnv('ADMIN_EMAIL').trim().toLowerCase();

  const adminPassword = requiredEnv('ADMIN_PASSWORD');

  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.usuario.upsert({
    where: {
      correo: adminEmail,
    },

    update: {
      nombre: process.env.ADMIN_NOMBRE ?? 'Administrador',
      apellido: process.env.ADMIN_APELLIDO ?? 'Principal',
      passwordHash: adminPasswordHash,
      idRol: adminRole.idRol,
      estado: EstadoRegistro.ACTIVO,
    },

    create: {
      nombre: process.env.ADMIN_NOMBRE ?? 'Administrador',

      apellido: process.env.ADMIN_APELLIDO ?? 'Principal',

      cedula: process.env.ADMIN_DOCUMENTO ?? '1000000000',

      correo: adminEmail,
      passwordHash: adminPasswordHash,

      cargo: 'Administrador del sistema',
      ciudad: 'Medellín',
      casino: 'CASINO PRINCIPAL',
      fechaNacimiento: new Date('1990-01-01'),
      telefono: '3000000000',

      codigoHelisa: 'ADM001',
      cuentaPuc: '510506',

      idTipoDoc: cc.idTipoDoc,
      idGenero: unspecifiedGender.idGenero,
      idRol: adminRole.idRol,

      imgUrl: null,
      estado: EstadoRegistro.ACTIVO,
    },
  });

  const testPasswordHash = await bcrypt.hash('Contador123!', 12);

  await prisma.usuario.upsert({
    where: {
      correo: 'contador@sistema.com',
    },

    update: {
      passwordHash: testPasswordHash,
      idRol: accountantRole.idRol,
      estado: EstadoRegistro.ACTIVO,
    },

    create: {
      nombre: 'Carlos',
      apellido: 'Ramírez',
      cedula: '1020304050',
      correo: 'contador@sistema.com',
      passwordHash: testPasswordHash,

      cargo: 'Contador',
      ciudad: 'Medellín',
      casino: 'CASINO CENTRO',
      fechaNacimiento: new Date('1995-05-15'),
      telefono: '3012345678',

      codigoHelisa: 'CONT001',
      cuentaPuc: '511030',

      idTipoDoc: cc.idTipoDoc,
      idGenero: maleGender.idGenero,
      idRol: accountantRole.idRol,

      imgUrl: null,
      estado: EstadoRegistro.ACTIVO,
    },
  });
}

async function main(): Promise<void> {
  console.log('Iniciando seed...');

  await createRoles();
  console.log('Roles creados.');

  await createDocumentTypes();
  console.log('Tipos de documento creados.');

  await createGenders();
  console.log('Géneros creados.');

  await createUsers();
  console.log('Usuarios creados.');

  console.log('Seed finalizado correctamente.');
}

main()
  .catch((error: unknown) => {
    console.error('Error ejecutando el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
