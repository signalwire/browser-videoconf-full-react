import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CONST from "../CONST";
import InputGroup from "react-bootstrap/InputGroup";
import Overlay from "react-bootstrap/esm/Overlay";
import Popover from "react-bootstrap/Popover";

export default function JoinCallForm({ onJoin = () => {} }) {
  let [name, setName] = useState("");
  let [room, setRoom] = useState(CONST.default_token);
  let [showHelp, setShowHelp] = useState(false);
  let ref = useRef(null);
  const [helpTarget, setHelpTarget] = useState(null);
  const handleHelpClick = (e) => {
    setShowHelp(!showHelp);
    setHelpTarget(event.target);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowHelp(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col lg={4} className="mt-5 mb-2">
          <h3>Join a Room</h3>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group className="mb-3" controlId="VideoCallName">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                pattern="[^' ']+"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="VideoRoom">
              <Form.Label>Room Token</Form.Label>
              <InputGroup className="mb-3" ref={ref}>
                <Form.Control
                  type="text"
                  placeholder="Room Token"
                  onChange={(e) => setRoom(e.target.value)}
                  value={room}
                  pattern="[^' ']+"
                  required
                />
                <Button variant="secondary" onClick={handleHelpClick}>
                  ?
                </Button>
                <Overlay
                  show={showHelp}
                  target={helpTarget}
                  placement="bottom"
                  container={ref}
                >
                  <Popover>
                    <Popover.Header as="h3">
                      How to get the Room Token?
                    </Popover.Header>
                    <Popover.Body>
                      <div>
                        <ul>
                          <li>
                            From your SignalWire dashboard, navigate to Video
                            tab from the sidebar.
                          </li>
                          <li>
                            If you haven't already, create a new Video
                            Conference.
                          </li>
                          <li>Copy the Moderator Token and paste here.</li>
                        </ul>
                        <img src="/help_token.png" style={{ width: "100%" }} />
                      </div>
                    </Popover.Body>
                  </Popover>
                </Overlay>
              </InputGroup>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              onClick={() => {
                if (name !== "" && room !== "") {
                  onJoin({ name, room });
                } else {
                  alert("Please fill all fields.");
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
