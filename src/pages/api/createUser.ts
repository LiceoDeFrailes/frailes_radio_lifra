import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminDb } from '../../../firebase/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, password, isAdmin } = req.body;

  try {
    
    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    await adminDb.collection('usuarios').doc(userRecord.uid).set({
      name,
      email,
      role: isAdmin ? 'admin' : 'estudiante',
      createdAt: new Date(),
    });

    res.status(200).json({ ok: true, uid: userRecord.uid });
  } catch (error: any) {
    res.status(400).json({ ok: false, error: error.message });
  }
}
