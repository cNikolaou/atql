import { PrismaClient } from '@prisma/client';
import { AttestationQueryBuilder } from './attestation-query';
import { Attestor, createSampleRoleBasedSchema } from './attestation-create';

const prisma = new PrismaClient();

async function main() {
  const schemaUid = '';
  const attester = '';
  const recipient = '';

  // Step 1: Create Schema
  const suid = await createSampleRoleBasedSchema();
  console.log(suid);

  // Step 2: Create Attestation
  const attestor = await Attestor.create(schemaUid);

  const data = [{ name: 'role', value: 'admin', type: 'string' }];

  const uid = await attestor.attest(recipient, data);
  console.log(uid);

  // Step 3: Query Attestations
  const schema = await AttestationQueryBuilder.create(schemaUid, prisma);
  console.log(`Schema ID:\n${schema.schemaUid()}\nShould match:\n${schemaUid}`);

  console.log(schema.getSchemaAbi());
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
