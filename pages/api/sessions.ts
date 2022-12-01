import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { AUTH } from '../../data/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ sessions?: any[]; error: boolean }>
) {
  try {
    const sessionsResponse = await axios.get(
      `https://${process.env.SPACE_NAME}.signalwire.com/api/video/room_sessions`,
      { auth: AUTH, params: { status: 'in-progress' } }
    );
    const sessions = sessionsResponse.data?.data;
    if (Array.isArray(sessions)) {
      return res.send({ sessions, error: false });
    } else {
      console.log(sessions, sessionsResponse.data, sessionsResponse.status);
      return res.status(400).send({ error: true });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: true });
  }
}
