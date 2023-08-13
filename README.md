# AtQL (Attestation Query Language)

AtQL is an query language to create query expressions for the attestations recorded
by the [Ethereum Attestation Service (EAS)](https://attest.sh/).

## AtQL Design

AtQL allows the creation of queries based on two types of conditions:
- database-level conditions: conditions for the fields recorded by EAS for each
attestation, such as "recipient", "attester", "time", "revoked"
- data-level conditions: conditions for the fields that are recorded as part of
the "data" field stored for each EAS attestation (the conditions follow the
naming pattern `data*` to be distinguishable)

This allows for powerful filtering of data which is important since anyone can
create attestations on EAS and only trustworthy data need to be fetched for
making decisions programmatically. Since anyone can create attestations on
a particular schema, it's important to fetch only the relevant data and then
do further filtering based on more conditions.

For example, if there is an `attester` address that we trust, and we are
interested to find out if there


```ts
import { AttestationQueryBuilder } from './attestation-query';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const schemaUid = '0x2154bad5fb5faf4e115afd58f23afdf112225816e0c58b682071470a5de9aafb';
const attester = '';

const schema = await AttestationQueryBuilder.create(schemaUid, prisma);

const matches = await schema
    .attesterIs(attester)                     // attester that we trust
    .recipientIs(recipient)                   // recipient we want to check
    .dataKeyWithValue('role', 'superuser')    // role that we are interested in
    .count();
```


## System Design and Dependencies

AtQL queries focus on chaining conditions and then executing the query. Currently,
execution depends on accessing a database with indexed data from the
[EAS indexer](https://github.com/ethereum-attestation-service/eas-indexing-service).

Future implementations can use other execution layers such as remote database
servers, REST APIs that have indexed data, GraphQL API that have indexed data,
or a decentralized database like Ceramic, can be used without the need to
change the DSL.


## Using AtQL

The simplest and tested way to currently use AtQL locally is to start the
[EAS indexer](https://github.com/ethereum-attestation-service/eas-indexing-service)
and exposing the port of the PostgreSQL on localhost. Add the API KEY for the
provider for the network that you are interested in (eg for Optimism Goerli
add `ALCHEMY_OPTIMISM_GOERLI_API_KEY`)

Then you can set the URL of the database like in the `.env.example`

```
DATABASE_URL=postgresql://username:password@host:post/eas-index
```

If you want to create schemas, attestations, and revoke attestations on the
same network that the attestations are, you have to add your API key for the
provider you want to use and the `WALLET_PRIVATE_KEY`.

### Connect to the DB
To run the queries on the indexed data you need to connect to a PostgreSQL database.
To do that create a `.env` file by copying the example one:

```bash
cp .evn.example .env
```

And replacing the `username`, `password`, `host`, and `port` with appropriate
values based on your setup.

### Update DB Schema
The current DB prisma schema is
[copied from](https://github.com/ethereum-attestation-service/eas-indexing-service/blob/b6248d1e35098547b9dae252be6bc5492dfb14f7/prisma/schema.prisma)
You might need to make the necessary updates in the future, alongside the
necessary migrations.