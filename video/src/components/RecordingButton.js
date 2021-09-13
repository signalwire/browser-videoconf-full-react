import React, { useState } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import axios from "axios";

export default function RecordingButton({ room, eventLogger, recordingReady }) {
  let [recordingObj, setRecordingObj] = useState();
  return (
    <ToggleButton
      variant="outline-danger"
      type="checkbox"
      checked={recordingObj}
      onClick={async (e) => {
        if (!recordingObj) {
          const rec = await room.startRecording()
          setRecordingObj(rec)
        } else {
          const recId = recordingObj.id
          await recordingObj.stop()
          setRecordingObj(undefined)

          eventLogger(`Your recording is being processed and will be downloaded shortly.`)

          // Get the recording
          // Give the server a bit of time to process the file
          await retry(async () => {
            const res = await axios.get(`/get_recording/${recId}`)
            if (res.data && res.data.uri) {
              recordingReady(res.data)
              return true
            }
            return false
          }, 1000, 5)
        }
      }}>
      Rec
    </ToggleButton>
  );
}

async function retry(fn, timeout_ms, retries) {
  if (retries > 0 && !await fn()) {
    await new Promise(resolve => setTimeout(resolve, timeout_ms));
    retry(fn, timeout_ms, retries - 1);
  }
}
