import type { NextApiRequest, NextApiResponse } from 'next';
import { revokeAttestation } from '../../lib/attestationUtils';

interface Data {
  result: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST' && req.body.attestationUid) {
    const result = await revokeAttestation(req.body.attestationUid);
    res.status(200).json({ result: result });
  } else {
    res.status(200).json({ result: false });
  }
}
