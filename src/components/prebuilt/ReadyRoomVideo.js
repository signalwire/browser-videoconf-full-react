import React, { useEffect, useRef, useState } from "react";
import * as SignalWire from "@signalwire/js";
import ReadyRoomEmbed from "./ReadyRoomEmbed";

export default function Video({
  onRoomInit = () => {},
  onRoomJoined = () => {},
  onRoomUpdate = () => {},
  eventLogger = (msg) => {
    console.log("Event:", msg);
  },
  onMemberListUpdate = () => {},
  joinDetails,
}) {
  let [isLoading, setIsLoading] = useState("true");
  let [setupDone, setSetupDone] = useState(false);
  let thisMemberId = useRef(null);
  let memberList = useRef([]);

  const [roomSession, setRoomSession] = useState(null);
  useEffect(() => {
    setupRoom();
    async function setupRoom() {
      if (roomSession === null) return;
      roomSession.on("room.joined", async (e) => {
        onRoomJoined(e.room);
        console.log("THE ROOM HAS BEEN JOINED");
        thisMemberId.current = e.member_id;
        memberList.current = e.room.members;
        console.log("THE MEMBERS I KNOW ARE", memberList.current);
        let thisMember = memberList.current.find((m) => m.id === e.member_id);

        console.log("YOUR ID IS ", e.member_id);
        onRoomUpdate({ thisMemberId: e.member_id, member: thisMember });
        onMemberListUpdate(e.room.members);
        console.log(e.room.members);
        eventLogger("You have joined the room.");

        roomSession.on("room.updated", async (e) => {
          eventLogger("Room has been updated");
        });

        roomSession.on("member.joined", async (e) => {
          eventLogger(e.member.name + " has joined the room.");
          memberList.current.push(e.member);
          console.log(memberList.current);
          onMemberListUpdate(memberList.current);
        });
        roomSession.on("member.updated", async (e) => {
          console.log("Member Updated", e);
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
          e.member.self = thisMemberId.current === e.member.id;
          onRoomUpdate({ member: e.member });
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
          eventLogger(memberThatLeft?.name + " has left the room.");

          if (thisMemberId.current === memberThatLeft?.id) {
            console.log("It is you who has left the room");
            onRoomUpdate({ left: true });
          }

          memberList.current = remainingMembers;
          onMemberListUpdate(memberList.current);
          console.log(memberList.current);
        });

        let layouts = (await roomSession.getLayouts()).layouts;
        let cameras = await SignalWire.WebRTC.getCameraDevicesWithPermissions();
        let microphones =
          await SignalWire.WebRTC.getMicrophoneDevicesWithPermissions();
        let speakers =
          await SignalWire.WebRTC.getSpeakerDevicesWithPermissions();

        setIsLoading(false);
        onRoomInit(roomSession, layouts, cameras, microphones, speakers);

        let camChangeWatcher = await SignalWire.WebRTC.createDeviceWatcher({
          targets: ["camera"],
        });
        camChangeWatcher.on("changed", (changes) => {
          eventLogger("The list of camera devices has changed");
          onRoomUpdate({ cameras: changes.devices });
        });
        let micChangeWatcher = await SignalWire.WebRTC.createDeviceWatcher({
          targets: ["microphone"],
        });
        micChangeWatcher.on("changed", (changes) => {
          eventLogger("The list of microphone devices has changed");
          onRoomUpdate({ microphones: changes.devices });
        });
        let speakerChangeWatcher = await SignalWire.WebRTC.createDeviceWatcher({
          targets: ["speaker"],
        });
        speakerChangeWatcher.on("changed", (changes) => {
          eventLogger("The list of speakers has changed");
          onRoomUpdate({ speakers: changes.devices });
        });
      });
    }
  }, [roomSession, onMemberListUpdate, onRoomInit, onRoomUpdate]);

  return (
    <div>
      <ReadyRoomEmbed
        onRoomReady={(rs) => setRoomSession(rs)}
        token={joinDetails.room}
        user={joinDetails.name}
      />
    </div>
  );
}
