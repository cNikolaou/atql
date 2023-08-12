import { PrismaClient } from '@prisma/client';
import { AttestationQueryBuilder } from './attestation';
import { Attestor } from './attestation-create';

const prisma = new PrismaClient();

async function main() {
  const schemaUid = '';
  const attester = '';
  const recipient = '';

  const schema = await AttestationQueryBuilder.create(schemaUid, prisma);
  console.log(`Schema ID:\n${schema.schemaUid()}\nShould match:\n${schemaUid}`);

  console.log(schema.getSchemaAbi());

  const attest = await Attestor.create(schemaUid);

  const data = [{ name: 'test2', value: 123, type: 'uint16' }];

  const uid = await attest.attest(recipient, data);
  console.log(uid);
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
