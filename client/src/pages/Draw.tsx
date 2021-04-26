import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { CollabCanvas } from "../components/Canvas";

export const Draw = ({ socket }: { socket: any }) => {
  const { id } = useParams<{ id: string }>();
  const router = useHistory();

  useEffect(() => {
    socket.emit("onDrawJoin", id);
    socket.on("notJoined", (id: string) => {
      router.push(`/join/${id}`);
    });
  });

  return (
    <div className="whiteboard">
      <CollabCanvas socket={socket} id={id} />
    </div>
  );
};
