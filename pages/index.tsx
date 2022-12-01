import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import useSWR from 'swr';
import RoomPreviews from '../components/RoomPreviews';

export default function Home() {
  const router = useRouter();
  const [roomName, setRoomName] = useState<string>('');
  const { data: sessions, error } = useSWR('/api/sessions');
  if (error || sessions?.error === true)
    return <div>Error trying to access room sessions in progress</div>;
  return (
    <Container>
      <h2 className="mt-5">Ongoing Rooms</h2>
      <RoomPreviews />
      <Button
        onClick={() => {
          router.push('/rooms/guest');
        }}
      >
        Join Guest Room
      </Button>
      <br />
      <h4 className="m-5">Or</h4>
      <Form style={{ maxWidth: 300 }}>
        <Form.Control
          type="text"
          required
          className="mb-2"
          placeholder="Enter Room Name Here"
          value={roomName}
          onChange={({ target: { value } }) => setRoomName(value ?? '')}
        />
        <Button
          onClick={() => {
            if (roomName !== undefined) router.push(`/rooms/${roomName}`);
          }}
        >
          Join Room
        </Button>
      </Form>
    </Container>
  );
}
