import { PrismaClient } from '@prisma/client';
import { AttestationQueryBuilder } from './attestation';

const attester = '0x5DA3C2c0250D311B2763bdf3cfa49C0f4a219987';
const recipient = '0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165';

test('DB-condition attestations before 23-8-12 should be 4', async () => {
  const schemaUid = '0x016300465697c6908e2b6cee414c5b4d3261b172dfba2ffb427efc744fd3831b';
  const prisma = new PrismaClient();
  const schema = await AttestationQueryBuilder.create(schemaUid, prisma);

  const dbOnlyCondition = await schema
    .attesterIs(attester)
    .recipientIs(recipient)
    .beforeDate(new Date(2023, 7, 12, 20, 0, 0))
    .dbCount();

  expect(dbOnlyCondition).toBe(4);
});

test('Data-condition attestation for string containing substring should be 1', async () => {
  const schemaUid = '0x016300465697c6908e2b6cee414c5b4d3261b172dfba2ffb427efc744fd3831b';
  const prisma = new PrismaClient();
  const schema = await AttestationQueryBuilder.create(schemaUid, prisma);

  const dbAndDataCondition = await schema
    .attesterIs(attester)
    .recipientIs(recipient)
    .dataValueIncludes('displayName', '1')
    .count();

  expect(dbAndDataCondition).toBe(2);
});

test('Data-condition with string exact match should be 3', async () => {
  const schemaUid = '0x016300465697c6908e2b6cee414c5b4d3261b172dfba2ffb427efc744fd3831b';
  const prisma = new PrismaClient();
  const schema = await AttestationQueryBuilder.create(schemaUid, prisma);

  const dbAndDataCondition = await schema
    .attesterIs(attester)
    .recipientIs(recipient)
    .dataKeyWithValue('displayName', 'TestName')
    .count();

  expect(dbAndDataCondition).toBe(3);
});

test('Data-condition with non-existing field', async () => {
  const schemaUid = '0x016300465697c6908e2b6cee414c5b4d3261b172dfba2ffb427efc744fd3831b';
  const prisma = new PrismaClient();
  const schema = await AttestationQueryBuilder.create(schemaUid, prisma);

  expect(
    schema
      .attesterIs(attester)
      .recipientIs(recipient)
      .dataKeyWithValue('display', 'TestName')
      .count(),
  ).rejects.toThrow();
});

test('Data-condition with uint equality', async () => {
  const schemaUid = '0x8f7e677e14e0112b06f2717d290d69334c53d5fe4af1f1c63415c60f5d881a85';
  const prisma = new PrismaClient();
  const schema = await AttestationQueryBuilder.create(schemaUid, prisma);

  const dbAndDataCondition = await schema
    .attesterIs(attester)
    .recipientIs(recipient)
    .dataKeyWithValue('test2', 10n)
    .count();

  expect(dbAndDataCondition).toBe(5);
});
