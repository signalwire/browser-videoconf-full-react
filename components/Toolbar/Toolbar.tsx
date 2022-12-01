import { Button, Container, Navbar } from 'react-bootstrap';
import { Video } from '@signalwire/js';
import {
  useLayouts,
  useMembers,
  usePermissions,
  useScreenShare,
  useStatus,
} from '@signalwire-community/react';
import Participants from './Participants/Participants';
import LayoutSelector from './LayoutSelector';
import Controls from './ControlButtons/Controls';
import { useState } from 'react';
import InviteToast from './InviteToast';

export default function Toolbar({
  roomSession,
}: {
  roomSession: Video.RoomSession;
}): JSX.Element {
  const { self, members } = useMembers(roomSession);
  const { toggle, active } = useScreenShare(roomSession);
  const { active: roomActive } = useStatus(roomSession);
  const layoutControls = useLayouts(roomSession);
  const P = usePermissions(roomSession);

  const [showInvite, setShowInvite] = useState(false);

  return (
    <>
      {InviteToast(showInvite, setShowInvite)}
      <Navbar bg="light" expand="lg" fixed="bottom">
        <Container style={{ width: 'fit-content', gap: 10 }}>
          <Controls control={self} self={true} disabled={!roomActive} />

          <Participants members={members} disabled={!roomActive} P={P} />

          <Button
            onClick={(e) => {
              setShowInvite(true);
              copyContent(window.location.href.split('?')[0]);
              async function copyContent(text: string) {
                try {
                  await navigator.clipboard.writeText(text);
                  console.log('Content copied to clipboard');
                } catch (err) {
                  console.error('Failed to copy: ', err);
                }
              }
            }}
          >
            Invite
          </Button>

          {P?.layout && (
            <LayoutSelector
              layoutControls={layoutControls}
              disabled={!roomActive}
            />
          )}

          {P?.screenshare && (
            <Button
              variant={active ? 'danger' : 'success'}
              onClick={toggle}
              disabled={!roomActive}
            >
              {active ? 'Stop' : 'Share Screen'}
            </Button>
          )}

          <Button
            variant="danger"
            onClick={() => {
              self?.remove();
            }}
            disabled={!roomActive}
          >
            Leave
          </Button>
        </Container>
      </Navbar>
    </>
  );
}
