import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";

export default function RoomPreview({
  room,
  onClick = () => {}
}) {
  const [ previewUrl, setPreviewUrl ] = useState(room.preview_url)

  React.useEffect(() => {
    const timer = setInterval(() => {
      const url = new URL(room.preview_url);
      setPreviewUrl(url.toString())
    }, 30 * 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Card style={{ width: 300, cursor: 'pointer' }} onClick={onClick}>
      <Card.Header>{room.display_name}</Card.Header>
      <video src={previewUrl} autoPlay loop muted playsInline></video>
    </Card>
  );
}
