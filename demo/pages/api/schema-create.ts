import type { NextApiRequest, NextApiResponse } from 'next';
import { createSchema } from '../../lib/attestationUtils';

interface Data {
  schemaUid: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST' && req.body.schema) {
    const schemaUid = await createSchema(req.body.schema);
    res.status(200).json({ schemaUid: schemaUid });
  }
}
