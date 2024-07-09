"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Streaming = () => {
  const router = useRouter();
  const [roomID, setRoomID] = useState();

  const joinRoom = () => {
    if (!roomID) return;
    router.push(`/room/${roomID}?roomID=${roomID}&role=Audience`);
  };
  const joinConference = () => {
    router.push(`/room/${roomID}?roomID=${roomID}&role=Audience`);
  };

  return (
    <main style={{margin:'20vh'}}>
      <div>
        <input
          type="text"
          placeholder="Enter ID"
          onChange={(e) => {
            setRoomID(e.target.value);
          }}
        />
        <button onClick={joinRoom}>Join</button>
        <button onClick={joinConference}>Conference</button>
      </div>
    </main>
  );
};

export default Streaming;
