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
  let thisMemberId = useRef(null);
  let memberList = useRef([]);

  useEffect(() => {
    let roomSession;
    let camChangeWatcher, micChangeWatcher, speakerChangeWatcher;

    (async () => {
      try {
        const reply = await axios.post(SERVERLOCATION + "/get_token", {
          user_name: joinDetails.name,
          room_name: joinDetails.room,
          mod: joinDetails.mod,
          space: "guides"
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
            thisMemberId.current = e.member_id;
            memberList.current = e.room.members;
            let thisMember = memberList.current.find(
              (m) => m.id === e.member_id
            );

            onRoomUpdate({ thisMemberId: e.member_id, member: thisMember });
            onMemberListUpdate(e.room.members);
            console.log(e.room.members);
            eventLogger("You have joined the room.");
          });

          roomSession.on("member.joined", async (e) => {
            eventLogger(e.member.name + " has joined the room.");
            memberList.current.push(e.member);
            console.log(memberList.current);
            onMemberListUpdate(memberList.current);
          });
          roomSession.on("member.updated", async (e) => {
            let updatedMember = memberList.current.find(
              (x) => x.id === e.member.id
            );

            if (updatedMember === undefined) return;
            updatedMember = { ...updatedMember, ...e.member };

            let newMemberList = memberList.current.filter(
              (x) => x.id !== e.member.id
            );
            newMemberList.push(updatedMember);
            memberList.current = newMemberList;

            onMemberListUpdate([...memberList.current]);
          });
          roomSession.on("layout.changed", async (e) => {
            onRoomUpdate({ layout: e.layout.name });
          });

          roomSession.on("member.left", async (e) => {
            let memberThatLeft = memberList.current.find(
              (m) => m.id === e.member.id
            );
            let remainingMembers = memberList.current.filter(
              (m) => m.id !== e.member.id
            );

            if (memberThatLeft === undefined) return;

            if (thisMemberId.current === memberThatLeft?.id) {
              console.log("It is you who has left the room");
              onRoomUpdate({ left: true });
            } else {
              eventLogger(memberThatLeft?.name + " has left the room.");
            }

            memberList.current = remainingMembers;
            onMemberListUpdate(memberList.current);
            console.log(memberList.current);
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
        //position: "relative",
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
