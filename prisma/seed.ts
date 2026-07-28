import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';

import {
  EstadoRegistro,
  PrismaClient,
} from '../src/generated/prisma/client';

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === '') {
    throw new Error(
      `La variable de entorno ${name} no está configurada.`,
    );
  }

  return value.trim();
}

const databaseUrl = new URL(requiredEnv('DATABASE_URL'));

const databaseName = decodeURIComponent(
  databaseUrl.pathname.replace(/^\//, ''),
);

if (!databaseName) {
  throw new Error(
    'DATABASE_URL no contiene el nombre de la base de datos.',
  );
}

const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port || 3306),
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseName,
  connectionLimit: Number(
    process.env.DATABASE_CONNECTION_LIMIT ?? 5,
  ),
});

const prisma = new PrismaClient({
  adapter,
});

async function createRoles(): Promise<void> {
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
        nombreRol: rol.nombreRol,
        descripcion: rol.descripcion,
        estado: EstadoRegistro.ACTIVO,
      },
    });
  }
}

async function createDocumentTypes(): Promise<void> {
  const documentTypes = [
    'CC',
    'CE',
    'PASAPORTE',
    'PPT',
    'NIT',
  ];

  for (const nombreDoc of documentTypes) {
    await prisma.tipoDocumento.upsert({
      where: {
        nombreDoc,
      },
      update: {
      },
      create: {
        nombreDoc,
      },
    });
  }
}

async function createGenders(): Promise<void> {
  const genders = [
    'MASCULINO',
    'FEMENINO',
    'NO ESPECIFICADO',
  ];

  for (const nombreGenero of genders) {
    await prisma.genero.upsert({
      where: {
        nombreGenero,
      },
      update: {
      },
      create: {
        nombreGenero,
      },
    });
  }
}

async function createCities(): Promise<void> {
  const cities = [
    'MEDELLÍN',
    'BOGOTÁ',
    'CALI',
    'BARRANQUILLA',
    'CARTAGENA',
  ];

  for (const nombreCiudad of cities) {
    await prisma.ciudad.upsert({
      where: {
        nombreCiudad,
      },
      update: {
        estado: EstadoRegistro.ACTIVO,
      },
      create: {
        nombreCiudad,
        estado: EstadoRegistro.ACTIVO,
      },
    });
  }
}

async function createCentrosCostos(): Promise<void> {
  const centros = [
    { codigo: 'CC-001', nombre: 'Centro Costo Principal' },
    { codigo: 'CC-002', nombre: 'Centro Costo Norte' },
  ];

  for (const cc of centros) {
    await prisma.centroCosto.upsert({
      where: { codigoCentroCosto: cc.codigo },
      update: { nombreCentroCosto: cc.nombre, estado: EstadoRegistro.ACTIVO },
      create: { codigoCentroCosto: cc.codigo, nombreCentroCosto: cc.nombre, estado: EstadoRegistro.ACTIVO },
    });
  }
}

async function createRazonesSociales(): Promise<void> {
  const razones = [
    { nit: '900.123.456-1', nombre: 'Razon Social Principal S.A.S.' },
    { nit: '800.987.654-2', nombre: 'Operadora de Casinos Ltda.' },
  ];

  for (const rs of razones) {
    await prisma.razonSocial.upsert({
      where: { nit: rs.nit },
      update: { nombreRazonSocial: rs.nombre, estado: EstadoRegistro.ACTIVO },
      create: { nit: rs.nit, nombreRazonSocial: rs.nombre, estado: EstadoRegistro.ACTIVO },
    });
  }
}

async function createCasinos(): Promise<void> {
  const medellin = await prisma.ciudad.findUniqueOrThrow({ where: { nombreCiudad: 'MEDELLÍN' } });
  const bogota = await prisma.ciudad.findUniqueOrThrow({ where: { nombreCiudad: 'BOGOTÁ' } });
  const ccPrincipal = await prisma.centroCosto.findUniqueOrThrow({ where: { codigoCentroCosto: 'CC-001' } });
  const rsPrincipal = await prisma.razonSocial.findUniqueOrThrow({ where: { nit: '900.123.456-1' } });

  const casinos = [
    {
      nombreCasino: 'CASINO PRINCIPAL',
      codigoDane: 'DANE-CAS-001',
      codigoEstablecimiento: 'EST-001',
      telefono: '3000000000',
      direccion: 'Dirección principal',
      idCiudad: medellin.idCiudad,
      idCentroCosto: ccPrincipal.idCentroCosto,
      idRazonSocial: rsPrincipal.idRazonSocial,
    },
    {
      nombreCasino: 'CASINO CENTRO',
      codigoDane: 'DANE-CAS-002',
      codigoEstablecimiento: 'EST-002',
      telefono: '3000000001',
      direccion: 'Dirección centro',
      idCiudad: bogota.idCiudad,
      idCentroCosto: ccPrincipal.idCentroCosto,
      idRazonSocial: rsPrincipal.idRazonSocial,
    },
    {
      nombreCasino: 'CASINO POBLADO',
      codigoDane: 'DANE-CAS-003',
      codigoEstablecimiento: 'EST-003',
      telefono: '6044445566',
      direccion: 'Carrera 43A # 10-25',
      idCiudad: medellin.idCiudad,
      idCentroCosto: ccPrincipal.idCentroCosto,
      idRazonSocial: rsPrincipal.idRazonSocial,
    }
  ];

  for (const casino of casinos) {
    await prisma.casino.upsert({
      where: { nombreCasino: casino.nombreCasino },
      update: {
        codigoDane: casino.codigoDane,
        codigoEstablecimiento: casino.codigoEstablecimiento,
        telefono: casino.telefono,
        direccion: casino.direccion,
        idCiudad: casino.idCiudad,
        idCentroCosto: casino.idCentroCosto,
        idRazonSocial: casino.idRazonSocial,
        estado: EstadoRegistro.ACTIVO,
      },
      create: {
        ...casino,
        estado: EstadoRegistro.ACTIVO,
      },
    });
  }
}

async function createUsers(): Promise<void> {
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

  const unspecifiedGender =
    await prisma.genero.findUniqueOrThrow({
      where: {
        nombreGenero: 'NO ESPECIFICADO',
      },
    });

  const maleGender =
    await prisma.genero.findUniqueOrThrow({
      where: {
        nombreGenero: 'MASCULINO',
      },
    });

  const medellin =
    await prisma.ciudad.findUniqueOrThrow({
      where: {
        nombreCiudad: 'MEDELLÍN',
      },
    });

  const casinoPrincipal =
    await prisma.casino.findUniqueOrThrow({
      where: {
        nombreCasino: 'CASINO PRINCIPAL',
      },
    });

  const casinoCentro =
    await prisma.casino.findUniqueOrThrow({
      where: {
        nombreCasino: 'CASINO CENTRO',
      },
    });

  const adminEmail = requiredEnv('ADMIN_EMAIL')
    .trim()
    .toLowerCase();

  const adminPassword = requiredEnv('ADMIN_PASSWORD');

  const adminPasswordHash = await bcrypt.hash(
    adminPassword,
    12,
  );

  await prisma.usuario.upsert({
    where: {
      correo: adminEmail,
    },

    update: {
      nombre:
        process.env.ADMIN_NOMBRE?.trim() ||
        'Administrador',

      apellido:
        process.env.ADMIN_APELLIDO?.trim() ||
        'Principal',

      cedula:
        process.env.ADMIN_DOCUMENTO?.trim() ||
        '1000000000',

      passwordHash: adminPasswordHash,

      cargo: 'Administrador del sistema',
      fechaNacimiento: new Date('1990-01-01'),
      telefono: '3000000000',

      codigoHelisa: 'ADM001',
      cuentaPuc: '510506',
      imgUrl: null,

      idTipoDoc: cc.idTipoDoc,
      idGenero: unspecifiedGender.idGenero,
      idRol: adminRole.idRol,
      idCiudad: medellin.idCiudad,
      idCasino: casinoPrincipal.idCasino,

      estado: EstadoRegistro.ACTIVO,
    },

    create: {
      nombre:
        process.env.ADMIN_NOMBRE?.trim() ||
        'Administrador',

      apellido:
        process.env.ADMIN_APELLIDO?.trim() ||
        'Principal',

      cedula:
        process.env.ADMIN_DOCUMENTO?.trim() ||
        '1000000000',

      correo: adminEmail,
      passwordHash: adminPasswordHash,

      cargo: 'Administrador del sistema',
      fechaNacimiento: new Date('1990-01-01'),
      telefono: '3000000000',

      codigoHelisa: 'ADM001',
      cuentaPuc: '510506',
      imgUrl: null,

      idTipoDoc: cc.idTipoDoc,
      idGenero: unspecifiedGender.idGenero,
      idRol: adminRole.idRol,
      idCiudad: medellin.idCiudad,
      idCasino: casinoPrincipal.idCasino,

      estado: EstadoRegistro.ACTIVO,
    },
  });

  const accountantPasswordHash = await bcrypt.hash(
    'Contador123!',
    12,
  );

  await prisma.usuario.upsert({
    where: {
      correo: 'contador@sistema.com',
    },

    update: {
      nombre: 'Carlos',
      apellido: 'Ramírez',
      cedula: '1020304050',
      passwordHash: accountantPasswordHash,

      cargo: 'Contador',
      fechaNacimiento: new Date('1995-05-15'),
      telefono: '3012345678',

      codigoHelisa: 'CONT001',
      cuentaPuc: '511030',
      imgUrl: null,

      idTipoDoc: cc.idTipoDoc,
      idGenero: maleGender.idGenero,
      idRol: accountantRole.idRol,
      idCiudad: medellin.idCiudad,
      idCasino: casinoCentro.idCasino,

      estado: EstadoRegistro.ACTIVO,
    },

    create: {
      nombre: 'Carlos',
      apellido: 'Ramírez',
      cedula: '1020304050',
      correo: 'contador@sistema.com',
      passwordHash: accountantPasswordHash,

      cargo: 'Contador',
      fechaNacimiento: new Date('1995-05-15'),
      telefono: '3012345678',

      codigoHelisa: 'CONT001',
      cuentaPuc: '511030',
      imgUrl: null,

      idTipoDoc: cc.idTipoDoc,
      idGenero: maleGender.idGenero,
      idRol: accountantRole.idRol,
      idCiudad: medellin.idCiudad,
      idCasino: casinoCentro.idCasino,

      estado: EstadoRegistro.ACTIVO,
    },
  });
}

async function main(): Promise<void> {
  console.log('Iniciando seed...');

  await createRoles();
  console.log('Roles creados o actualizados.');

  await createDocumentTypes();
  console.log('Tipos de documento creados o actualizados.');

  await createGenders();
  console.log('Géneros creados o actualizados.');

  await createCities();
  console.log('Ciudades creadas o actualizadas.');

  await createCentrosCostos();
  console.log('Centros de costos creados o actualizados.');

  await createRazonesSociales();
  console.log('Razones sociales creadas o actualizadas.');

  await createCasinos();
  console.log('Casinos creados o actualizados.');

  await createUsers();
  console.log('Usuarios creados o actualizados.');

  console.log('Seed finalizado correctamente.');
}

main()
  .catch((error: unknown) => {
    console.error('Error ejecutando el seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });