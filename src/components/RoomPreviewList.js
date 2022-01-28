import React, { useEffect, useState } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import RoomPreview from "./RoomPreview"
import SERVERLOCATION from "../serverLocation";

export default function RoomPreviewList() {
  const [isLoading, setIsLoading] = useState(true);
  const [ roomList, setRoomList ] = React.useState([])

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
    socket.on("rooms_updated", (rooms) => {
      setRoomList(rooms);
      setIsLoading(false);
    });
  }, []);

  // React.useEffect(() => {
  //   const timer = setInterval(refresh, 30 * 1000)
  //   refresh()

  //   return () => {
  //     clearInterval(timer)
  //   }
  // }, [])

  async function refresh() {
    const reply = await axios.get(SERVERLOCATION + "/joinable_rooms");
    setRoomList(reply.data)
  }

  return (
    <div>
      {roomList.map(room => <RoomPreview key={room.id} room={room} />)}
    </div>
  );
}
