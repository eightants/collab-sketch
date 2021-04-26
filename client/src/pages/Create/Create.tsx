import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../../components/Button/Button";

// Function to generate unique room ID
const uniqueId = (length = 5) => {
  return Math.ceil(Math.random() * Date.now())
    .toPrecision(length)
    .toString()
    .replace(".", "")
    .slice(0, length);
};

type LobbyObject = {
  id?: string;
  settings?: any;
};

export const Create = ({ socket }: { socket: any }) => {
  const [lobby] = useState<LobbyObject>({});
  const router = useHistory();

  useEffect(() => {
    socket.on("newLobbyCreated", (data: any) => {
      router.push(`/lobby/${data.id}`);
    });
  });
  // Tell server to create new lobby
  const handleCreateLobby = () => {
    lobby.id = uniqueId();
    socket.emit("onCreateLobby", lobby);
    console.log("CREATE");
  };
  return (
    <div>
      <Button text="Create Session" variant="dark" onClick={handleCreateLobby} />
      <Link to="/">
        <Button text="Back" />
      </Link>
    </div>
  );
};
