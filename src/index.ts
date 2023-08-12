import { PrismaClient } from '@prisma/client';
import { AttestationQueryBuilder } from './attestation';

const prisma = new PrismaClient();

async function main() {
  const schemaUid = '';
  const attester = '';
  const recipient = '';

  const schema = await AttestationQueryBuilder.create(schemaUid, prisma);
  console.log(`Schema ID:\n${schema.schemaUid()}\nShould match:\n${schemaUid}`);

  const countTest = await schema
    .attesterIs(attester)
    .recipientIs(recipient)
    .beforeDate(new Date(2023, 7, 11, 23, 50, 50))
    .dbCount();
  console.log(countTest);
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
