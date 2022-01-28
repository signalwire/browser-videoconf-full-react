import React, { useCallback, useState } from "react";
import RoomPreviewList from "../components/RoomPreviewList";

export default function Explore({}) {
    return <div style={{ textAlign: 'center', marginBottom: '1em' }}>
        <h2>Explore Rooms</h2>
        <RoomPreviewList />
    </div>
}