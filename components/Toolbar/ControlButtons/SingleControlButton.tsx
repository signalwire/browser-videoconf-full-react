import { Button, SplitButton, Dropdown } from 'react-bootstrap';
import { X, Check } from 'react-bootstrap-icons';

function SingleControlButton({
  enabledIcon = () => <Check />,
  disabledIcon = () => <X />,
  onClick = () => {
    alert('Clicked');
  },
  onSelect = (x) => {
    alert('selected ' + x);
  },
  toggledOn = false,
  items,
  disabled = false,
  size = 'sm',
}: {
  disabledIcon: () => JSX.Element;
  enabledIcon: () => JSX.Element;
  onClick: (_: any) => void;
  onSelect: (_: any) => void;
  toggledOn: boolean;
  items: MediaDeviceInfo[] | undefined;
  disabled: boolean;
  size: 'sm' | 'lg' | 'md' | undefined;
}) {
  // Show a simple button to toggle controls if only one device is present.
  if (items === undefined || items.length === 1)
    return (
      <Button
        onClick={onClick}
        variant={toggledOn ? 'success' : 'danger'}
        disabled={disabled}
        size={size as any}
      >
        {toggledOn ? enabledIcon() : disabledIcon()}
      </Button>
    );

  // If no devices at all, we don't need to display toggle buttons
  if (items.length === 0) return null;

  // If multiple devices, show proper full-size split button
  return (
    <SplitButton
      drop="up"
      title={toggledOn ? enabledIcon() : disabledIcon()}
      onClick={onClick}
      variant={toggledOn ? 'success' : 'danger'}
      disabled={disabled}
      size={size as any}
    >
      {items.map((x) => (
        <Dropdown.Item
          key={x.deviceId}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelect(x);
          }}
        >
          {x.label}
        </Dropdown.Item>
      ))}
    </SplitButton>
  );
}

export default SingleControlButton;
