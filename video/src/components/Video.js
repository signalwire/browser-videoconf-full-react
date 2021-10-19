import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as SignalWire from "@signalwire/js";
import useScreenSize from "use-screen-size";

export default function Video({
  onRoomInit = () => {},
  onRoomUpdate = () => {},
  width = 400,
  joinDetails: roomDetails = { room: "signalwire", name: "JohnDoe" },
  eventLogger = (msg) => {
    console.log("Event:", msg);
  },
  onMemberListUpdate = () => {},
}) {
  let [isLoading, setIsLoading] = useState("true");
  let [setupDone, setSetupDone] = useState(false);
  let thisMemberId = useRef(null);
  let memberList = useRef([]);
  let screen = useScreenSize();

  // Keep track of the information about the current layout
  let currLayout = useRef(null)

  // Style and position of the overlay
  let [overlayStyle, setOverlayStyle] = useState({ display: 'none' })
  let [speakerOverlayStyle, setSpeakerOverlayStyle] = useState({ display: 'none' })

  useEffect(() => {
    if (setupDone) return;
    setup_room();
    async function setup_room() {
      setSetupDone(true);
      let token, room;
      try {
        token = await axios.post("/get_token", {
          user_name: roomDetails.name,
          room_name: roomDetails.room,
          mod: roomDetails.mod,
        });
        console.log(token.data);
        token = token.data.token;

        try {
          console.log("Setting up RTC session");
          try {
            room = await SignalWire.Video.createRoomObject({
              token,
              rootElementId: "temp",
              video: true,
            });
          } catch (e) {
            console.log(e);
          }
          room.on("room.joined", async (e) => {
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
          room.on("room.updated", async (e) => {
            eventLogger("Room has been updated");
          });
          room.on("member.joined", async (e) => {
            eventLogger(e.member.name + " has joined the room.");
            memberList.current.push(e.member);
            console.log(memberList.current);
            onMemberListUpdate(memberList.current);
          });
          room.on("member.updated", async (e) => {
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
          room.on("layout.changed", async (e) => {
            currLayout.current = e.layout
            onRoomUpdate({ layout: e.layout.name });
          });

          room.on("member.left", async (e) => {
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

          room.on('member.talking', (e) => {
            // Update the UI: the participant with id `e.member.id` is talking iff e.member.talking == true
            updateSpeakerOverlay(e.member.id, e.member.talking)
          })

          await room.join();

          let layouts = (await room.getLayouts()).layouts;
          let cameras =
            await SignalWire.WebRTC.getCameraDevicesWithPermissions();
          let microphones =
            await SignalWire.WebRTC.getMicrophoneDevicesWithPermissions();
          let speakers =
            await SignalWire.WebRTC.getSpeakerDevicesWithPermissions();

          setIsLoading(false);
          onRoomInit(room, layouts, cameras, microphones, speakers);

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
          let speakerChangeWatcher =
            await SignalWire.WebRTC.createDeviceWatcher({
              targets: ["speaker"],
            });
          speakerChangeWatcher.on("changed", (changes) => {
            eventLogger("The list of speakers has changed");
            onRoomUpdate({ speakers: changes.devices });
          });
        } catch (error) {
          setIsLoading(false);
          console.error("Something went wrong", error);
        }
      } catch (e) {
        setIsLoading(false);
        console.log(e);
        alert("Error encountered. Please try again.");
      }
    }
  }, [
    roomDetails,
    eventLogger,
    onMemberListUpdate,
    onRoomInit,
    onRoomUpdate,
    setupDone,
  ]);

  function updateOverlay(e) {
    if (!currLayout.current)
      return

    // Mouse coordinates relative to the video element, in percentage (0 to 100)
    const rect = document.getElementById('temp').getBoundingClientRect();
    const x = 100 * (e.clientX - rect.left) / rect.width;
    const y = 100 * (e.clientY - rect.top) / rect.height;

    const layer = currLayout.current.layers.find(lyr => lyr.x < x && x < lyr.x + lyr.width && 
                                                        lyr.y < y && y < lyr.y + lyr.height)
    if (layer && layer.reservation !== 'fullscreen') {
      setOverlayStyle({
        display: 'block',
        position: 'absolute',
        overflow: 'hidden',
        top: layer.y + '%',
        left: layer.x + '%',
        width: layer.width + '%',
        height: layer.height + '%',
        zIndex: 1,
        background: '#0d6efd38',
        backdropFilter: 'blur(10px)',
        pointerEvents: 'none'
      })
    } else {
      setOverlayStyle({display: 'none'})
    }
  }

  function updateSpeakerOverlay(memberId, speaking) {
    if (!currLayout.current)
      return

    console.log("AXA")
    console.log(memberId)
    console.log(currLayout.current.layers)
    const layer = currLayout.current.layers.find(lyr => lyr.member_id === memberId)
    console.log(layer)
    if (layer && speaking) {
      setSpeakerOverlayStyle({
        display: 'block',
        position: 'absolute',
        overflow: 'hidden',
        top: layer.y + '%',
        left: layer.x + '%',
        width: layer.width + '%',
        height: layer.height + '%',
        zIndex: 1,
        background: 'transparent',
        border: '5px solid yellow',
        pointerEvents: 'none'
      })
    } else {
      setSpeakerOverlayStyle({display: 'none'})
    }
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            // width,
            minHeight: 0.5 * screen.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading ...
        </div>
      )}
      <div
        id="temp"
        style={{
          width,
          minHeight: 0.5 * screen.height,
          position: 'relative'
        }}
        onMouseOver={updateOverlay}
        onMouseMove={updateOverlay}
        onMouseLeave={updateOverlay}
      >
        <div style={overlayStyle}></div>
        <div style={speakerOverlayStyle}></div>
      </div>
    </div>
  );
}
