import { ToastContainer, Toast } from 'react-bootstrap';

export default function InviteToast(
  showInvite: boolean,
  setShowInvite: (show: boolean) => void
) {
  return (
    <ToastContainer position="top-end">
      <Toast
        autohide={true}
        show={showInvite}
        onClose={() => setShowInvite(false)}
        delay={1000}
      >
        <Toast.Body>Invite link copied.</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
