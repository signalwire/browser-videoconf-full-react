import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function JoinCallForm({
  roomName,
  onJoin = () => {},
  mod = false,
}) {
  let [name, setName] = useState("");
  let [joinAsGuest, setJoinAsGuest] = useState(false);
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col lg={4}>
          <h4>
            Join '{roomName}'{mod && !joinAsGuest ? " as moderator" : ""}
          </h4>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group className="mb-3" controlId="VideoCallName">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                pattern="[^' ']+"
                required
              />
            </Form.Group>
            {mod && (
              <Form.Check
                type="checkbox"
                label="Please add me without moderator privileges"
                checked={joinAsGuest}
                onChange={(e) => {
                  setJoinAsGuest(e.target.checked);
                  console.log(e.target.checked);
                }}
              />
            )}
            <Button
              className="mt-1"
              variant="primary"
              type="submit"
              onClick={() => {
                if (name !== "") {
                  onJoin({ name, room: roomName, mod: mod && !joinAsGuest });
                } else {
                  alert(
                    "Please Fill all fields (todo use bootstrap alert or form error messages)"
                  );
                }
              }}
            >
              Join
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
