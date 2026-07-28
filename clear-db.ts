import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './src/generated/prisma/client';

const databaseUrl = new URL(process.env.DATABASE_URL!);
const databaseName = decodeURIComponent(databaseUrl.pathname.replace(/^\//, ''));

const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port || 3306),
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseName,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.usuario.deleteMany();
  await prisma.casino.deleteMany();
  console.log('DB Cleared');
}

main().catch(console.error).finally(() => prisma.$disconnect());
