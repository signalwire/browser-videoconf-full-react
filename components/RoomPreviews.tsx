import { RoomPreview } from '@signalwire-community/react';
import { useRouter } from 'next/router';
import { Card } from 'react-bootstrap';
import useSWR from 'swr';

export default function RoomPreviews() {
  const router = useRouter();
  const { data: sessions, error } = useSWR('/api/sessions');
  if (error || sessions?.error === true)
    return <div>Error trying to access room sessions in progress</div>;
  if (!sessions?.sessions || sessions?.sessions?.length === 0) {
    return (
      <div className="p-5 bg-light rounded-2 my-3">
        <h4 className="text-muted">No ongoing rooms</h4>
      </div>
    );
  }
  return (
    <>
      <div className={'d-flex flex-wrap justify-content-start gap-5 my-4'}>
        {sessions?.sessions?.map((session: any) => (
          <div key={session.id}>
            <Card onClick={(e) => router.push(`/rooms/${session.name}`)}>
              <RoomPreview
                previewUrl={session.preview_url}
                loadingUrl={'https://swrooms.com/swloading.gif'}
                style={{ height: 150, aspectRatio: '16 / 9' }}
              />
              <Card.Body>
                <Card.Title>{session.display_name ?? session.name}</Card.Title>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
