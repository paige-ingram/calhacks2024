import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken } from '@/lib/spotify';

export default async function callback(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;

  if (!code) {
    console.error('Authorization code is missing');
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    const accessToken = await getAccessToken(code);
    if (accessToken) {
      // Log the success and redirect
      console.log('Successfully authenticated with Spotify');
      res.redirect(`/emotional-history?token=${accessToken}`);
    } else {
      console.error('Failed to authenticate with Spotify');
      res.status(400).json({ error: 'Failed to authenticate with Spotify' });
    }
  } catch (error: unknown) {
    const err = error as any;

    console.error('Error in Spotify callback:', err.message || err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
