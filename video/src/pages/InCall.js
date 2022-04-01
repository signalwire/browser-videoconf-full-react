import React, { useCallback, useState } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Video from "../components/Video";
import Select from "../components/Select";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Events from "../components/Events";
import InviteButton from "../components/Invite.js";
import Participants from "../components/Participants";
import NavBar from "react-bootstrap/Navbar";
import {
  MdMic,
  MdMicOff,
  MdVideocam as VideocamIcon,
  MdVideocamOff,
  MdVolumeOff,
  MdVolumeUp
} from "react-icons/md";

import { useHistory } from "react-router";
import SplitButtonMenu from "../components/SplitButton.js";
import ScreenShareButton from "../components/ShareScreenButton";

export default function InCall({ roomDetails }) {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);

  const [layouts, setLayouts] = useState([]);
  const [curLayout, setCurLayout] = useState();

  const [cameras, setCameras] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [speakers, setSpeakers] = useState([]);

  const [roomSession, setRoomSession] = useState({});
  const [event, setEvent] = useState(null);

  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);

  const [memberList, setMemberList] = useState([]);

  const [, setUpdateSignal] = useState(true);
  const updateView = () => setUpdateSignal((x) => !x);

  const logEvent = useCallback((msg, title, variant) => {
    setEvent({ text: msg, title, variant });
  }, []);

  const onRoomInit = useCallback(
    (roomSession, layouts, cameras, microphones, speakers) => {
      setLayouts(layouts);
      setCameras(cameras);
      setMicrophones(microphones);
      setSpeakers(speakers);
      setRoomSession(roomSession);
      setIsLoading(false);
    },
    []
  );

  const onRoomUpdate = useCallback(
    (updatedValues) => {
      if (updatedValues.cameras !== undefined)
        setCameras(updatedValues.cameras);
      if (updatedValues.speakers !== undefined)
        setSpeakers(updatedValues.speakers);
      if (updatedValues.microphones !== undefined)
        setMicrophones(updatedValues.microphones);
      if (updatedValues.left === true) history.push("/");
      if (updatedValues.layout !== undefined)
        setCurLayout(updatedValues.layout);
      if (updatedValues.member !== undefined) {
        const mem = updatedValues.member;
        console.log("Current User", mem);
        setAudioMuted(mem.audio_muted);
        setVideoMuted(mem.video_muted);
        setSpeakerMuted(mem.deaf);
      }
    },
    [history]
  );

  return (
    <>
      <Container fluid>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <div
            style={{
              backgroundColor: "black",
              flex: 1,
              marginBottom: 10,
              maxHeight: "calc(100vh - 65px - 60px)",
              minWidth: 300
            }}
            className="justify-content-md-center"
          >
            <Video
              onRoomInit={onRoomInit}
              onRoomUpdate={onRoomUpdate}
              joinDetails={roomDetails}
              eventLogger={logEvent}
              onMemberListUpdate={useCallback((list) => {
                setMemberList(list);
              }, [])}
            />
            <Events log={event} />
          </div>
          <div
            style={{
              minWidth: 250
            }}
          >
            <Participants
              memberList={memberList}
              mod={roomDetails.mod}
              onMemberUpdate={async (event) => {
                if (event.action === "remove") {
                  console.log("Removing Member", event.id);
                  await roomSession.removeMember({ memberId: event.id });
                  console.log("Removed member", event.id);
                  if (event.id === roomSession?.memberId) history.push("/");
                } else if (event.action === "mute_video") {
                  await roomSession.videoMute({ memberId: event.id });
                  if (event.id === roomSession?.memberId) setVideoMuted(true);
                } else if (event.action === "mute_audio") {
                  await roomSession.audioMute({ memberId: event.id });
                  if (event.id === roomSession?.memberId) setAudioMuted(true);
                } else if (event.action === "unmute_audio") {
                  await roomSession.audioUnmute({ memberId: event.id });
                  if (event.id === roomSession?.memberId) setAudioMuted(false);
                } else if (event.action === "unmute_video") {
                  await roomSession.videoUnmute({ memberId: event.id });
                  if (event.id === roomSession?.memberId) setVideoMuted(false);
                }
              }}
            />
          </div>
        </div>
      </Container>

      {!isLoading && (
        <NavBar fixed="bottom">
          <Container fluid className="justify-content-md-center">
            <Row>
              <Col xs="auto" style={{ marginTop: 5 }}>
                <SplitButtonMenu
                  muted={videoMuted}
                  setMuted={async (value) => {
                    if (value) {
                      await roomSession.videoMute();
                      setVideoMuted(true);
                    } else {
                      await roomSession.videoUnmute();
                      setVideoMuted(false);
                    }
                  }}
                  deviceName="Camera"
                  devices={cameras}
                  pickDevice={async (id) => {
                    await roomSession.updateCamera({ deviceId: id });
                    updateView();
                  }}
                  muteIcon={() => <VideocamIcon />}
                  unmuteIcon={() => <MdVideocamOff />}
                />
              </Col>

              <Col xs="auto" style={{ marginTop: 5 }}>
                <SplitButtonMenu
                  muted={audioMuted}
                  setMuted={async (value) => {
                    if (value) {
                      await roomSession.audioMute();
                      setAudioMuted(true);
                    } else {
                      await roomSession.audioUnmute();
                      setAudioMuted(false);
                    }
                  }}
                  deviceName="Microphone"
                  devices={microphones}
                  pickDevice={async (id) => {
                    await roomSession.updateMicrophone({ deviceId: id });
                    updateView();
                  }}
                  muteIcon={() => <MdMic />}
                  unmuteIcon={() => <MdMicOff />}
                />
              </Col>

              <Col xs="auto" style={{ marginTop: 5 }}>
                <SplitButtonMenu
                  muted={speakerMuted}
                  setMuted={async (value) => {
                    if (value) {
                      await roomSession.deaf();
                      setSpeakerMuted(true);
                    } else {
                      await roomSession.undeaf();
                      setSpeakerMuted(false);
                    }
                  }}
                  deviceName="Speaker"
                  devices={speakers}
                  pickDevice={async (id) => {
                    await roomSession.updateSpeaker({ deviceId: id });
                    updateView();
                  }}
                  muteIcon={() => <MdVolumeUp />}
                  unmuteIcon={() => <MdVolumeOff />}
                />
              </Col>

              {roomDetails.mod && (
                <Col xs="auto" style={{ marginTop: 5 }}>
                  <Select
                    items={layouts}
                    placeholder="Select Layout"
                    value={curLayout}
                    onChange={async (value) => {
                      await roomSession.setLayout({ name: value });
                      setCurLayout(value);
                    }}
                  />
                </Col>
              )}

              <Col xs="auto" style={{ marginTop: 5 }}>
                <InviteButton
                  mod={roomDetails.mod}
                  room={roomDetails.room}
                  eventLogger={logEvent}
                />
              </Col>
              <Col xs="auto" style={{ marginTop: 5 }}>
                <ScreenShareButton room={roomSession} />
              </Col>
              <Col xs="auto" style={{ marginTop: 5 }}>
                <Button
                  onClick={async () => {
                    // await roomSession.leave();
                    history.push("/");
                  }}
                  variant="danger"
                >
                  Leave
                </Button>
              </Col>
            </Row>
          </Container>
        </NavBar>
      )}
    </>
  );
}
