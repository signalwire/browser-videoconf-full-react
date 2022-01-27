import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomPreview from "./RoomPreview"
import SERVERLOCATION from "../serverLocation";

export default function RoomPreviewList() {

  const [ roomList, setRoomList ] = React.useState([])

  React.useEffect(() => {
    const timer = setInterval(async () => {
      const reply = await axios.get(SERVERLOCATION + "/joinable_rooms");
      setRoomList(reply.data)
    }, 30 * 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div>
      {roomList.map(room => <RoomPreview key={room.id} room={room} />)}
    </div>
  );
}
