import { PrismaClient } from '@prisma/client';
import { AttestationQueryBuilder } from './attestation';

const prisma = new PrismaClient();

async function main() {
  const schemaUid = '0x016300465697c6908e2b6cee414c5b4d3261b172dfba2ffb427efc744fd3831b';

  const schema = await AttestationQueryBuilder.create(schemaUid, prisma);
  console.log(`Schema ID:\n${schema.id()}\nShould match:\n${schemaUid}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
