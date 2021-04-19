import React from "react";
import { CollabCanvas } from "../components/Canvas";

export const Draw = ({ socket } : {socket: any}) => {
  return (
    <div className="whiteboard">
      <CollabCanvas socket={socket}/>
    </div>
  );
};
