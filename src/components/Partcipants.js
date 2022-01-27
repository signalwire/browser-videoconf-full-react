import React from "react";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {
  MdCallEnd,
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Participants({
  memberList,
  onMemberUpdate = () => {},
  mod = false,
}) {
  if (!mod)
    return (
      <Card>
        <Card.Header>Participants</Card.Header>
        {memberList.map((member) => (
          <ListGroup.Item key={member.id}>{member.name + " "}</ListGroup.Item>
        ))}
      </Card>
    );

  return (
    <Card style={{ width: "100%" }}>
      <Card.Header>Participants</Card.Header>
      <ListGroup variant="flush">
        {memberList.map((member) => (
          <ListGroup.Item key={member.id} style={{ padding: "2px 0" }}>
            <Container>
              <Row>
                <Col
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {member.name + " "}
                </Col>

                <Col md="auto">
                  <OverlayTrigger
                    key={member.id + "aud"}
                    placement="bottom"
                    overlay={
                      <Tooltip variant="info">
                        {member.audio_muted ? "Unmute Audio" : "Mute Audio"}
                      </Tooltip>
                    }
                  >
                    <Button
                      style={{ padding: "2px 5px", marginLeft: 1 }}
                      variant={!member.audio_muted ? "success" : "danger"}
                      onClick={() => {
                        member.audio_muted
                          ? onMemberUpdate({
                              action: "unmute_audio",
                              id: member.id,
                            })
                          : onMemberUpdate({
                              action: "mute_audio",
                              id: member.id,
                            });
                      }}
                    >
                      {member.audio_muted ? <MdMic /> : <MdMicOff />}
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    key={member.id + "vid"}
                    placement="bottom"
                    overlay={
                      <Tooltip variant="info">
                        {member.video_muted ? "Unmute Video" : "Mute Video"}
                      </Tooltip>
                    }
                  >
                    <Button
                      style={{ padding: "2px 5px", marginLeft: 1 }}
                      variant={!member.video_muted ? "success" : "danger"}
                      onClick={() => {
                        member.video_muted
                          ? onMemberUpdate({
                              action: "unmute_video",
                              id: member.id,
                            })
                          : onMemberUpdate({
                              action: "mute_video",
                              id: member.id,
                            });
                      }}
                    >
                      {member.video_muted ? <MdVideocam /> : <MdVideocamOff />}
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    key={member.id}
                    placement="bottom"
                    overlay={<Tooltip variant="info">Remove Member</Tooltip>}
                  >
                    <Button
                      style={{ padding: "2px 5px", marginLeft: 1 }}
                      variant="danger"
                      onClick={() => {
                        onMemberUpdate({ action: "remove", id: member.id });
                      }}
                    >
                      <MdCallEnd />
                    </Button>
                  </OverlayTrigger>
                </Col>
              </Row>
            </Container>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}
