import type { NextApiRequest, NextApiResponse } from 'next';
import { createAttestation } from '../../lib/attestationUtils';

interface Data {
  attestationUid: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    if (req.body.schemaUid === '' || req.body.recipient === '' || req.body.role === '') {
      res.status(400);
    } else {
      const attestationUid = await createAttestation(
        req.body.schemaUid,
        req.body.recipient,
        req.body.role,
      );
      res.status(200).json({ attestationUid: attestationUid });
    }
  } else {
    res.status(400);
  }
}
