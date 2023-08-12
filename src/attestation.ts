import { PrismaClient, Schema } from '@prisma/client';

export class AttestationQueryBuilder {
  private condition: any = {};
  private prisma: PrismaClient;
  private schema: Schema;

  constructor(schema: Schema, prismaClient: PrismaClient) {
    this.prisma = prismaClient;
    this.schema = schema;
  }

  static async create(schemaUid: string, prismaClient: PrismaClient) {
    const schema = await prismaClient.schema.findUnique({
      where: { id: schemaUid },
    });

    if (!schema) {
      throw new Error(`Schema with UID ${schemaUid} not found.`);
    }
    return new AttestationQueryBuilder(schema, prismaClient);
  }

  creator() {
    return this.schema.creator;
  }

  id() {
    return this.schema.id;
  }
}
