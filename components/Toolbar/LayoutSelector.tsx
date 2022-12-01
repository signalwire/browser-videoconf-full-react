import { Dropdown } from 'react-bootstrap';

export default function LayoutSelector({
  layoutControls,
  disabled,
}: {
  layoutControls: {
    layouts: string[];
    setLayout: (_: any) => void;
    currentLayout: string;
  };
  disabled: boolean;
}) {
  const { layouts, setLayout, currentLayout } = layoutControls;

  return (
    <Dropdown drop="up">
      <Dropdown.Toggle disabled={disabled}>{currentLayout}</Dropdown.Toggle>
      <Dropdown.Menu>
        {layouts.map((layout: string) => (
          <Dropdown.Item
            key={layout}
            onClick={() => setLayout({ name: layout })}
          >
            {layout}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
