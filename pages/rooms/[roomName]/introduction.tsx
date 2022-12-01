import { useRouter } from 'next/router';
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Introduction() {
  const router = useRouter();
  const { roomName } = router.query;
  const [name, setName] = useState<string | undefined>('');
  const [mod, setMod] = useState<boolean>(false);
  return (
    <Container className="mt-4">
      <h2>Joining room {roomName}</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Enter your name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your Name Here"
            pattern="[A-Za-z0-9_-]*"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Form.Text className="text-muted">
            Only letters, numbers, hyphen and underscore allowed
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Make me a moderator for this room"
            checked={mod}
            onChange={(e) => setMod(e.target.checked)}
          />
        </Form.Group>

        <Button
          variant="primary"
          onClick={(e) => {
            e.preventDefault();
            router.push(
              `/rooms/${roomName}?userName=${name}&mod=${
                mod ? 'true' : 'false'
              }`
            );
          }}
        >
          Join Room
        </Button>
      </Form>
    </Container>
  );
}
