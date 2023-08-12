import { Attestation, PrismaClient, Schema } from '@prisma/client';

export class AttestationQueryBuilder {
  private condition: any = {};
  private prisma: PrismaClient;
  private schema: Schema;
  private schemaAbiTypes: string[];

  constructor(schema: Schema, prismaClient: PrismaClient, includeRevoked?: boolean) {
    this.prisma = prismaClient;
    this.schema = schema;
    this._getSchemaAbiTypes();

    if (!includeRevoked) {
      this.condition.revoked = false;
    }
  }

  static async create(schemaUid: string, prismaClient: PrismaClient, includeRevoked?: boolean) {
    const schema = await prismaClient.schema.findUnique({
      where: { id: schemaUid },
    });

    if (!schema) {
      throw new Error(`Schema with UID ${schemaUid} not found.`);
    }

    return new AttestationQueryBuilder(schema, prismaClient, includeRevoked);
  }

  _getSchemaAbiTypes() {
    const abiParts = this.schema.schema.split(',');
    this.schemaAbiTypes = abiParts.map((part) => part.split(' ')[0]);
  }

  ////
  // Schema-related functions to return relevant data. These Schema data
  // doesn't change so returning data from the in-memory `this.schema`
  // object is fine.

  schemaCreator() {
    return this.schema.creator;
  }

  schemaUid() {
    return this.schema.id;
  }

  getSchemaAbiTypes() {
    return this.schemaAbiTypes;
  }

  ////
  // Condition-building functions

  attesterIs(attester: string): this {
    this.condition.attester = attester;
    return this;
  }

  recipientIs(recipient: string): this {
    this.condition.recipient = recipient;
    return this;
  }

  beforeDate(date: Date): this {
    const timestamp = Math.floor(date.getTime() / 1000);
    console.log(timestamp);
    this.condition.time = { lt: timestamp };
    return this;
  }

  afterDate(date: Date): this {
    const timestamp = Math.floor(date.getTime() / 1000);
    this.condition.time = { gt: timestamp };
    return this;
  }

  ////
  // Functions that run the queries and return the DB results without any
  // other processing. They can be used for introspection and to run more
  // complex queries on the returned data.

  async dbFindMany(): Promise<any[]> {
    this.condition.schemaId = this.schemaUid();
    return await this.prisma.attestation.findMany({
      where: this.condition,
    });
  }

  async dbFindFirst(): Promise<Attestation | null> {
    this.condition.schemaId = this.schemaUid();
    return await this.prisma.attestation.findFirst({
      where: this.condition,
    });
  }

  async dbFindUnique(): Promise<Attestation | null> {
    this.condition.schemaId = this.schemaUid();
    return await this.prisma.attestation.findUnique({
      where: this.condition,
    });
  }

  async dbCount(): Promise<number> {
    this.condition.schemaId = this.schemaUid();
    return await this.prisma.attestation.count({
      where: this.condition,
    });
  }
}
