### Connect to the DB
To run the queries on the indexed data you need to connect to a PostgreSQL database.
To do that create a `.env` file by copying the example one:

```bash
cp .evn.example .env
```

And replacing the `username`, `password`, `host`, and `port` with appropriate
values based on your setup.

### Update DB Schema
The current DB prisma schema is [copied from](https://github.com/ethereum-attestation-service/eas-indexing-service/blob/b6248d1e35098547b9dae252be6bc5492dfb14f7/prisma/schema.prisma)
You might need to make the necessary updates in the future, alongside the
necessary migrations.