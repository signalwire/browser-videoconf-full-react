import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import VideoPlayer from "./VideoPlayer";

export default function RoomPreview({
  room,
  onClick = () => {}
}) {
  return (
    <Card style={{ width: 300, cursor: 'pointer' }} onClick={onClick}>
      <Card.Header>{room.display_name}</Card.Header>
      <VideoPlayer src={room.preview_url} refreshInterval={30 * 1000} />
    </Card>
  );
}
