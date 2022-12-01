import { Dropdown } from 'react-bootstrap';
import { MegaphoneFill } from 'react-bootstrap-icons';
import Controls from '../ControlButtons/Controls';

function TalkingIcon({ talking = false }) {
  return (
    <div
      style={{
        marginLeft: 3,
        width: 20,
        height: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {talking && <MegaphoneFill size={12} />}
    </div>
  );
}

export default function ParticipantDropdown({
  members,
  disabled = true,
  P,
}: {
  members: any;
  disabled: boolean;
  P: any;
}) {
  return (
    <Dropdown drop="up">
      <Dropdown.Toggle disabled={disabled}>Participants</Dropdown.Toggle>
      <Dropdown.Menu>
        {members.map((member: any) => (
          <Dropdown.Item
            key={member.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {member.name}
            <TalkingIcon talking={member.talking} />
            <span style={{ padding: 10 }} />
            <div>
              {P?.member?.audio_full &&
                P?.member?.video_full &&
                P?.member?.speaker_full && (
                  <Controls control={member} self={false} disabled={disabled} />
                )}
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
