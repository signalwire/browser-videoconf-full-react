import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { useHistory } from "react-router-dom";
import RoomPreview from "./RoomPreview"
import SERVERLOCATION from "../serverLocation";

export default function RoomPreviewList() {
  const history = useHistory();
  const [roomList, setRoomList] = React.useState([])

  useEffect(() => {
    /**
     * We use socket.io to listen to the rooms_updated events that we emit
     * server-side. The value that we get is an array, with each entry being an
     * object such as
     *
     *     {
     *       "id": "1b3f7a21-3191-1175-ae15-30c558a5afbc",
     *       "name": "Roomname1",
     *       "display_name": "Roomname1",
     *     }
     */
    const socket = socketIOClient(SERVERLOCATION);
    socket.emit("public_messages");
    socket.on("rooms_updated", (rooms) => {
      if (rooms.roomSessions) {
        setRoomList(rooms.roomSessions);
      }
    });
  }, []);

  function onRoomClicked(room) {
    history.push('/invite?m=1&r=' + encodeURIComponent(room.name))
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: 20
    }}>
      {
        roomList.map(room => <RoomPreview
          key={room.id}
          room={room}
          onClick={() => onRoomClicked(room)}
        />
        )
      }
    </div>
  );
}
