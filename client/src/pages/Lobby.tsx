import React, { useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button } from "../components/Button/Button";

export const Lobby = ({ socket }: { socket: any }) => {
  const router = useHistory();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    socket.on("gameStarted", () => {
      router.push(`/draw/${id}`);
    });
  });

  const handleStart = () => {
    socket.emit("onStartGame", id);
  };

  return (
    <div>
      <Button text="Start Session" variant="dark" onClick={handleStart} />
      <Link to="/create">
        <Button text="Back" />
      </Link>
    </div>
  );
};
