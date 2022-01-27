import React, { useState } from "react";
import Button from "react-bootstrap/Button";

export default function ScreenShareButton({ room }) {
  let [screenShareObj, setScreenShareObj] = useState();
  return (
    <Button
      onClick={async () => {
        if (room === undefined || room === null) {
          setScreenShareObj(undefined);
          return;
        }
        if (screenShareObj === undefined) {
          let sc;
          try {
            sc = await room.createScreenShareObject();
          } catch (e) {
            setScreenShareObj(undefined);
            console.log(e);
            return;
          }
          setScreenShareObj(sc);
        } else {
          try {
            screenShareObj.leave();
          } catch (e) {
            console.log(e);
          }
          setScreenShareObj(undefined);
        }
      }}
    >
      {screenShareObj === undefined
        ? "Share Screen"
        : "Turn off Screen Sharing"}
    </Button>
  );
}
