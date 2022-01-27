import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

export default function InviteButton({
  room = "room",
  mod,
  eventLogger = (msg) => {
    console.log("InviteEvent", msg);
  },
}) {
  function generateLink(r, type = "normal") {
    if (type === "normal")
      return (
        window.location.protocol +
        "//" +
        window.location.host +
        "/invite?r=" +
        r
      );
    else if (type === "mod") return generateLink(r) + "&m=mod";
  }

  return (
    <>
      <Dropdown drop="up">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Invite
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Header>As guest</Dropdown.Header>
          <Dropdown.Item
            onClick={() => {
              let tx = document.createElement("textarea");
              document.body.appendChild(tx);
              tx.value = generateLink(room);
              tx.select();
              document.execCommand("copy");
              document.body.removeChild(tx);
              // setShowCopiedToast(true);
              eventLogger(
                "The link " + generateLink(room) + " copied to clipboard.",
                "Link copied",
                "info"
              );
            }}
          >
            {generateLink(room)}
          </Dropdown.Item>
          {mod && (
            <>
              <Dropdown.Header>As moderator</Dropdown.Header>
              <Dropdown.Item
                onClick={() => {
                  let tx = document.createElement("textarea");
                  document.body.appendChild(tx);
                  tx.value = generateLink(room, "mod");
                  tx.select();
                  document.execCommand("copy");
                  document.body.removeChild(tx);
                  // setShowCopiedToast(true);
                  eventLogger(
                    "The link " +
                      generateLink(room, "mod") +
                      " copied to clipboard.",
                    "Link copied",
                    "info"
                  );
                }}
              >
                {generateLink(room, "mod")}
              </Dropdown.Item>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
