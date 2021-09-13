import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CreatableSelect from 'react-select/creatable';
import axios from "axios";

export default function JoinCallForm({ onJoin = () => {} }) {
  let [name, setName] = useState("");
  let [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    axios.get("/rooms").then(v => {
      setRooms(v.data.map(room => ({value: room.name, label: room.name})))
    })
  }, [])

  function isValidNewOption(inputValue, selectValue, selectOptions, accessors) {
    if (inputValue.trim() === "") return false
    if (selectOptions.map(v => v.value).includes(inputValue)) return false
    if (!inputValue.match(/^[A-Za-z0-9_-]+$/g)) return false
    return true
  }

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
              <Form.Label>Room Name</Form.Label>
              <CreatableSelect
                placeholder="Room Name"
                isClearable
                allowCreateWhileLoading
                options={rooms}
                isValidNewOption={isValidNewOption}
                onChange={(value, actionMeta) => setRoom(value ? value.value : '')}
                value={room ? {value: room, label: room} : undefined}
                pattern="[^' ']+"
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              onClick={() => {
                if (name !== "" && room !== "") {
                  onJoin({ name, room });
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
