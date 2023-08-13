import { PrismaClient } from '@prisma/client';
import { AttestationQueryBuilder } from '../../dist/attestation';

const schemaUid = '0x944eea04e198d9c7c429014f253fb5eac07193acfd38a6f91d39cc0a9700af46';
const attester = '0x5DA3C2c0250D311B2763bdf3cfa49C0f4a219987';

const prisma = new PrismaClient();

export async function isSuperuser(recipient: string) {
  const schema = await AttestationQueryBuilder.create(schemaUid, prisma);
  console.log(`Schema ID:\n${schema.schemaUid()}\nShould match:\n${schemaUid}`);

  const dbOnlyCondition = await schema
    .attesterIs(attester)
    .recipientIs(recipient)
    .beforeDate(new Date(2023, 7, 12, 20, 0, 0))
    .dbCount();

  return dbOnlyCondition > 0;
}
