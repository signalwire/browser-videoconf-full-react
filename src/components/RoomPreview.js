import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";

export default function RoomPreview({ room }) {
  const [ previewUrl, setPreviewUrl ] = useState(room.preview_url)

  React.useEffect(() => {
    const timer = setInterval(() => {
      const url = new URL(room.preview_url);
      url.searchParams.set('cache_timestamp', +new Date());
      setPreviewUrl(url.toString())
    }, 30 * 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Card>
      <Card.Header>{room.display_name}</Card.Header>
      <video src={previewUrl} autoplay loop muted playsinline></video>
    </Card>
  );
}
