import { PrismaClient } from '@prisma/client';
import { AttestationQueryBuilder } from '../../dist/attestation';
import { Attestor, schemaBuilder } from '../../dist/attestation-create';

const schemaUid = '0x2154bad5fb5faf4e115afd58f23afdf112225816e0c58b682071470a5de9aafb';
const attester = '0x5DA3C2c0250D311B2763bdf3cfa49C0f4a219987';

const prisma = new PrismaClient();

export async function isSuperuser(recipient: string) {
  const schema = await AttestationQueryBuilder.create(schemaUid, prisma);

  try {
    const dbOnlyCondition = await schema
      .attesterIs(attester)
      .recipientIs(recipient)
      .dataKeyWithValue('role', 'superuser')
      .count();

    return dbOnlyCondition > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function createSchema(schema: string) {
  // TODO: need to do some schema validation here

  return await schemaBuilder(schema);
}

export async function createAttestation(schemaUid: string, recipient: string, role: string) {
  // TODO: need to do some schema validation here
  const attestor = await Attestor.create(schemaUid);
  const data = [{ name: 'role', value: role, type: 'string' }];

  return await attestor.attest(recipient, data);
}
