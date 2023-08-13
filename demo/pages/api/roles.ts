import type { NextApiRequest, NextApiResponse } from 'next';
import { isSuperuser, isAdmin } from '../../lib/attestationUtils';

type Data = {
  isSuperuser: boolean;
  isAdmin: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const superuser = await isSuperuser(req.body.address);
    const admin = await isAdmin(req.body.address);
    res.status(200).json({
      isSuperuser: superuser,
      isAdmin: admin,
    });
  } else {
    res.status(200).json({
      isSuperuser: false,
      isAdmin: false,
    });
  }
}
