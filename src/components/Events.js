import React, { useEffect, useRef, useState } from "react";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

export default function Events({ log = {} }) {
  let [logQueue, setLogQueue] = useState([]);
  let counter = useRef(0);
  useEffect(() => {
    if (log === null) return;
    console.log("Got log ", log);
    setLogQueue((l) => [
      ...l,
      {
        index: counter.current,
        title: log.title,
        text: log.text,
        variant: log.variant
      }
    ]);
    counter.current += 1;
  }, [log]);
  return (
    <ToastContainer
      position="top-end"
      className="m-1"
      style={{ zIndex: "100000" }}
    >
      {logQueue.map((l) => (
        <Toast
          key={l.index}
          autohide
          delay={4000}
          onClose={(e) => {
            console.log("Closing Event index", l.index);
            setLogQueue((logQueue) =>
              logQueue.filter((m) => m.index !== l.index)
            );
          }}
          className="m-1"
          bg={l.variant ?? l.variant}
        >
          <Toast.Header>{l.title ?? "Event"}</Toast.Header>
          <Toast.Body>{l.text}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}
