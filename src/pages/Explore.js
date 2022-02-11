import React from "react";
import Button from 'react-bootstrap/Button';
import { useHistory } from "react-router-dom";

import RoomPreviewList from "../components/RoomPreviewList";

export default function Explore({}) {
    const history = useHistory();

    return <div className="mt-5 mb-2" style={{ textAlign: 'center' }}>
        <h2>Join a Room</h2>
        <div style={{ marginTop: 50, marginBottom: 50 }}>
            <RoomPreviewList />
        </div>
        <Button
            variant="primary"
            onClick={() => {
                history.push('/join')
            }}>
            Join a new Room
        </Button>
    </div>
}