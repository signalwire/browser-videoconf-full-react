import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { AUTH, SPACE_NAME } from '../../data/auth';
import { FULL_PERMISSIONS, GUEST_PERMISSIONS } from '../../data/permissions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ token?: string; error: boolean }>
) {
  const { room_name, user_name, mod } = req.query;

  if (room_name === undefined) return res.status(422).json({ error: true });

  try {
    const tokenResponse = await axios.post(
      `https://${SPACE_NAME}.signalwire.com/api/video/room_tokens`,
      {
        room_name,
        user_name,
        enable_room_previews: true,
        permissions: mod === 'true' ? FULL_PERMISSIONS : GUEST_PERMISSIONS,
      },
      { auth: AUTH } // pass {username: project_id, password: api_token} as basic auth
    );
    const token = tokenResponse.data.token;
    if (token !== undefined) res.status(200).json({ token, error: false });
    else res.status(400).json({ error: true });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: true });
  }
}
