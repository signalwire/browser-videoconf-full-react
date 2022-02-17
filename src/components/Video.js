import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as SignalWire from "@signalwire/js";
import SERVERLOCATION from "../serverLocation";

export default function Video({
  onRoomInit = () => {},
  onRoomUpdate = () => {},
  joinDetails = { room: "signalwire", name: "JohnDoe" },
  eventLogger = (msg) => {
    console.log("Event:", msg);
  },
  onMemberListUpdate = () => {}
}) {
  let [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let roomSession;
    let camChangeWatcher, micChangeWatcher, speakerChangeWatcher;

    (async () => {
      try {
        const reply = await axios.post(SERVERLOCATION + "/public/video_token", {
          user_name: joinDetails.name,
          room_name: joinDetails.room,
          mod: !!joinDetails.mod,
          enable_room_previews: true,
        });
        console.log(reply.data);
        const token = reply.data.token;

        try {
          console.log("Setting up RTC session");

          roomSession = new SignalWire.Video.RoomSession({
            token: token,
            rootElement: document.querySelector("#video-root")
          });

          roomSession.on("room.joined", async (e) => {
            const thisMember = e.room_session.members.find(
              (m) => m.id === e.member_id
            );

            onRoomUpdate({ member: thisMember });
            onMemberListUpdate(e.room_session.members);
            eventLogger("You have joined the room.");
          });

          roomSession.on("memberList.updated", (e) => {
            onMemberListUpdate(e.members);
          })

          roomSession.on("member.joined", async (e) => {
            eventLogger(e.member.name + " has joined the room.");
          });

          roomSession.on("member.left", async (e) => {
            console.log("member.left")
            if (e.member.id === roomSession.memberId) {
              console.log("It is you who has left the room");
              onRoomUpdate({ left: true });
            } else {
              eventLogger(e.member.name + " has left the room.");
            }
          });

          console.log("Join");

          await roomSession.join();

          console.log("Joined");

          let cameras = await SignalWire.WebRTC.getCameraDevicesWithPermissions();
          let microphones = await SignalWire.WebRTC.getMicrophoneDevicesWithPermissions();
          let speakers = await SignalWire.WebRTC.getSpeakerDevicesWithPermissions();

          setIsLoading(false);
          onRoomInit(roomSession, cameras, microphones, speakers);

          camChangeWatcher = await SignalWire.WebRTC.createDeviceWatcher({
            targets: ["camera"]
          });
          camChangeWatcher.on("changed", (changes) => {
            // The list of camera devices has changed
            onRoomUpdate({ cameras: changes.devices });
          });
          micChangeWatcher = await SignalWire.WebRTC.createDeviceWatcher({
            targets: ["microphone"]
          });
          micChangeWatcher.on("changed", (changes) => {
            // The list of microphone devices has changed
            onRoomUpdate({ microphones: changes.devices });
          });
          speakerChangeWatcher = await SignalWire.WebRTC.createDeviceWatcher({
            targets: ["speaker"]
          });
          speakerChangeWatcher.on("changed", (changes) => {
            // The list of speakers has changed
            onRoomUpdate({ speakers: changes.devices });
          });
        } catch (error) {
          setIsLoading(false);
          console.error("Something went wrong", error);
        }
      } catch (e) {
        setIsLoading(false);
        console.log(e);
        alert(
          "Error encountered. Are you sure the backend is active at " +
            SERVERLOCATION +
            "?"
        );
      }
    })();

    // Cleanup function
    return async () => {
      try {
        // Remove event listeners
        camChangeWatcher?.removeAllListeners();
        micChangeWatcher?.removeAllListeners();
        speakerChangeWatcher?.removeAllListeners();
        roomSession?.off("room.joined");
        roomSession?.off("member.joined");
        roomSession?.off("member.updated");
        roomSession?.off("member.left");

        // Leave the room
        await roomSession?.leave();
      } catch (_) {}
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      {isLoading && (
        <div
          style={{
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          Loading...
        </div>
      )}
      <div
        id="video-root"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          aspectRatio: "16/9",
          margin: "auto"
        }}
      ></div>
    </div>
  );
}
