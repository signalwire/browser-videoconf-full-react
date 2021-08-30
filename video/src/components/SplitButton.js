import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
export default function SplitButtonMenu({
  muted = false,
  setMuted = () => {},
  muteIcon = () => <></>,
  unmuteIcon = () => <></>,
  deviceName = "device",
  devices = [],
  pickDevice = () => {},
}) {
  return (
    <Dropdown drop="up" as={ButtonGroup}>
      <Button
        variant={muted ? "danger" : "success"}
        onClick={async () => {
          if (muted) {
            setMuted(false);
          } else {
            setMuted(true);
          }
        }}
      >
        {muted ? unmuteIcon() : muteIcon()}
      </Button>

      <Dropdown.Toggle
        split
        variant={muted ? "danger" : "success"}
        id="dropdown-split-basic"
      />

      <Dropdown.Menu>
        <Dropdown.Header>Select {deviceName}</Dropdown.Header>
        {devices.map((c) => (
          <Dropdown.Item
            key={c.deviceId}
            onClick={() => {
              pickDevice(c.deviceId);
            }}
          >
            {c.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
