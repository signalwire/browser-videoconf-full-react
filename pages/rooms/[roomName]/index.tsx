import { Video } from '@signalwire-community/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import useSWRImmutable from 'swr/immutable';
import Toolbar from '../../../components/Toolbar/Toolbar';

export default function Room() {
  const router = useRouter();
  const { roomName, userName, mod } = router.query;
  const [roomSession, setRoomSession] = useState<any>();

  const { data: token } = useSWRImmutable(
    roomName !== undefined
      ? `/api/token?room_name=${roomName}&user_name=${userName}&mod=${mod}`
      : null
  );

  useEffect(() => {
    if (router.isReady && userName === undefined)
      router.push(`/rooms/${roomName}/introduction`);
  }, [userName]);

  if (!router.isReady) {
    return <div>Loading</div>;
  }

  if (roomName === undefined || roomName === 'undefined') return <></>;
  return (
    <Container>
      {token?.token && (
        <>
          <Video
            token={token.token}
            onRoomReady={(r) => {
              setRoomSession(r);
            }}
            onRoomLeft={() => router.push('/')}
          />
          {roomSession && <Toolbar roomSession={roomSession} />}
        </>
      )}
    </Container>
  );
}
