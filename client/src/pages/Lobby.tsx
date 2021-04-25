import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button/Button";

export const Lobby = ({ socket } : {socket: any}) => {
  return (
    <div>
      <Button text="Start Session" variant="dark" />
      <Link to="/">
        <Button text="Back" />
      </Link>
    </div>
  );
};
