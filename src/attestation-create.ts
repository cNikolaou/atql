import {
  EAS,
  SchemaEncoder,
  SchemaRecord,
  SchemaRegistry,
  SchemaItem,
} from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

const EAS_CONTRACT_ADDRESS = '0x4200000000000000000000000000000000000021';
const SCHEMA_REGISTRY_CONTRACT_ADDRESS = '0x4200000000000000000000000000000000000020';

const eas = new EAS(EAS_CONTRACT_ADDRESS);
const schemaRegistry = new SchemaRegistry(SCHEMA_REGISTRY_CONTRACT_ADDRESS);

const NETWORK = 'optimism-goerli';
const alchemyProvider = new ethers.AlchemyProvider(
  NETWORK,
  process.env.ALCHEMY_OPTIMISM_GOERLI_API_KEY,
);

const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, alchemyProvider);
eas.connect(signer);
schemaRegistry.connect(signer);

export class Attestor {
  // A class for streamlining and abstracting attestations

  private schemaRecord: SchemaRecord;
  private schema: string;

  constructor(schema: SchemaRecord) {
    this.schemaRecord = schema;
    this.schema = schema.schema;
  }

  static async create(schemaUid: string) {
    const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUid });

    if (!schemaRecord) {
      throw new Error(`Schema with UID ${schemaUid} not found.`);
    }

    return new Attestor(schemaRecord);
  }

  async attest(
    recipient: string,
    data: SchemaItem[],
    expirationTime?: bigint,
    revocable?: boolean,
  ) {
    const schemaEncoder = new SchemaEncoder(this.schema);

    try {
      const encodedData = schemaEncoder.encodeData(data);

      const tx = await eas.attest({
        schema: this.schemaRecord.uid,
        data: {
          recipient: recipient,
          expirationTime: expirationTime || 0n,
          revocable: revocable || true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();

      return newAttestationUID;
    } catch (error) {
      console.log(`Error ${error}`);
      console.log(`Follow schema: [${this.schema}]`);
    }
  }
}

export async function schemaBuilder(schema: string, resolverAddress?: string, revocable?: boolean) {
  // Streamlined the deployment of a schema based on the provided `schema` string.

  const tx = await schemaRegistry.register({
    schema,
    resolverAddress: resolverAddress || SCHEMA_REGISTRY_CONTRACT_ADDRESS,
    revocable: revocable || true,
  });

  const schemaUid = await tx.wait();

  return schemaUid;
}

export async function createSampleRoleBasedSchema() {
  // Create a simple schema that can be used for role-based access control

  const schema = 'string role';
  return await schemaBuilder(schema);
}
