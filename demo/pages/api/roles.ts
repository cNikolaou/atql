import type { NextApiRequest, NextApiResponse } from 'next';
import { isSuperuser } from '../../lib/roleAttestations';

type Data = {
  isSuperuser: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const superuser = await isSuperuser(req.body.address);
    res.status(200).json({ isSuperuser: superuser });
  } else {
    res.status(200).json({ isSuperuser: false });
  }
}
