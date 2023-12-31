import { Attestation, PrismaClient, Schema } from '@prisma/client';
import { AbiCoder } from 'ethers';

////
// Use the class to instantiate a query builder for a specific schema.
// Chain conditions to create the query you want to run. There are two
// types of conditions:
//
//  - db-level conditions for all the fields recorded by EAS for each
//    attestation, such as "recipient", "attester", "time", "revoked"
//
//  - data-level conditions for the fields that are recorded as part of
//    the "data" field stored for each EAS attestation (the conditions
//    follow the naming pattern `data*` to be distinguishable)
//
export class AttestationQueryBuilder {
  private condition: any = {};
  private dataConditionGroups: Array<Array<Function>> = [[]];
  private prisma: PrismaClient;
  private schema: Schema;
  private schemaAbiTypes: string[];
  private schemaAbiNames: string[];

  constructor(schema: Schema, prismaClient: PrismaClient, includeRevoked?: boolean) {
    this.prisma = prismaClient;
    this.schema = schema;
    this.condition.schemaId = this.schemaUid();
    this._getSchemaAbi();

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

  _getSchemaAbi() {
    const abiParts = this.schema.schema.split(',');
    this.schemaAbiTypes = abiParts.map((part) => part.split(' ')[0]);
    this.schemaAbiNames = abiParts.map((part) => part.split(' ')[1]);
  }

  _decodeData(data) {
    // Decode attestation data based on the ABI types and the ABI names.
    // Return an object with key-value pairs:
    // - key is the field name
    // - value is the decoded value of the field

    const decodedValues = AbiCoder.defaultAbiCoder().decode(this.schemaAbiTypes, data);

    let decodedData = {};
    for (let i = 0; i < decodedValues.length; i++) {
      decodedData[this.schemaAbiNames[i]] = decodedValues[i];
    }

    return decodedData;
  }

  ////
  // Logical conditions
  //

  or(): this {
    this.dataConditionGroups.push([]);
    return this;
  }

  // all conditions between the ORs are practically AND so
  // no need to do anything additional here
  and(): this {
    return this;
  }

  ////
  // Schema-related functions to return relevant data. These Schema data
  // doesn't change so returning data from the in-memory `this.schema`
  // object is fine.
  //

  schemaCreator() {
    return this.schema.creator;
  }

  schemaUid() {
    return this.schema.id;
  }

  getSchemaAbi() {
    return this.schema.schema;
  }

  ////
  // Data condition-building functions for application level filtering
  // after the data is fetched from the DB.
  //

  dataKeyWithValue(key: string, value: string | number | bigint): this {
    const condition = (decodedData: any) => {
      if (!decodedData.hasOwnProperty(key)) {
        throw new Error(`Field "${key}" does not exist in data.`);
      }
      return decodedData[key] === value;
    };

    this.dataConditionGroups[this.dataConditionGroups.length - 1].push(condition);
    return this;
  }

  dataValueLessThan(key: string, value: number | bigint): this {
    const condition = (decodedData: any) => {
      if (!decodedData.hasOwnProperty(key)) {
        throw new Error(`Field "${key}" does not exist in data.`);
      }
      const valueType = typeof decodedData[key];
      if (valueType !== 'number' && valueType !== 'bigint') {
        throw new Error(`Value of "${key}" is not a number.`);
      }
      return decodedData[key] < value;
    };

    this.dataConditionGroups[this.dataConditionGroups.length - 1].push(condition);
    return this;
  }

  dataValueGreaterThan(key: string, value: number | bigint): this {
    const condition = (decodedData: any) => {
      if (!decodedData.hasOwnProperty(key)) {
        throw new Error(`Field "${key}" does not exist in data.`);
      }
      const valueType = typeof decodedData[key];
      if (valueType !== 'number' && valueType !== 'bigint') {
        throw new Error(`Value of "${key}" is not a number.`);
      }
      return decodedData[key] > value;
    };

    this.dataConditionGroups[this.dataConditionGroups.length - 1].push(condition);
    return this;
  }

  dataValueIncludes(key: string, substring: string): this {
    const condition = (decodedData: any) => {
      if (!decodedData.hasOwnProperty(key)) {
        throw new Error(`Field "${key}" does not exist in data.`);
      }
      if (typeof decodedData[key] !== 'string') {
        throw new Error(`Value of "${key}" is not a string.`);
      }
      return decodedData[key].includes(substring);
    };

    this.dataConditionGroups[this.dataConditionGroups.length - 1].push(condition);
    return this;
  }

  async findMany(): Promise<Attestation[]> {
    // First filter the data based on the DB conditions.
    // Then test the data conditions for each entry returned by the
    // DB query.

    // Find DB matches
    const dbMatches = await this.prisma.attestation.findMany({
      where: this.condition,
    });

    // Decode data for each entry and filter based on the data conditions
    const dataMatches = dbMatches.filter((attestation) => {
      const decodedData = this._decodeData(attestation.data);
      return this.dataConditionGroups.some((group) =>
        group.every((condition) => condition(decodedData)),
      );
    });

    // Return the entries that match the DB conditions
    // AND the attestation-data conditions
    return dataMatches;
  }

  async count(): Promise<number> {
    const matchedAttestations = await this.findMany();
    return matchedAttestations.length;
  }

  ////
  // Prisma condition-building functions for queries executed at the DB.
  //

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
  //

  async dbFindMany(): Promise<any[]> {
    return await this.prisma.attestation.findMany({
      where: this.condition,
    });
  }

  async dbFindFirst(): Promise<Attestation | null> {
    return await this.prisma.attestation.findFirst({
      where: this.condition,
    });
  }

  async dbFindUnique(): Promise<Attestation | null> {
    return await this.prisma.attestation.findUnique({
      where: this.condition,
    });
  }

  async dbCount(): Promise<number> {
    return await this.prisma.attestation.count({
      where: this.condition,
    });
  }
}
