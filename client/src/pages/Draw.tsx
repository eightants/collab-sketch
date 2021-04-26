import React, { useState, useEffect } from "react";
import { CollabCanvas } from "../components/Canvas";
import { Time } from "../components/DisplayTime"

export const Draw = ({ socket } : { socket: any }) => {

  const [drawingUser, setDrawingUser] = useState(null);

  const [timeM, setTimeM] = useState(0);
  const [timeS, setTimeS] = useState(0);

  useEffect(() => {
    socket.on("turnTick", (drawer: any, minutes: number, seconds: number) => {
      setTimeM(minutes);
      setTimeS(seconds);

      if (drawer !== drawingUser && (minutes > 0 || seconds > 0)) {
        // console.log("My ID: " + socket.id);
        // console.log("Drawing: " + drawer.userID);
        setDrawingUser(drawer.userID);
      } else if (minutes === 0 && seconds === 0) {
        // console.log("Drawing: None");
        setDrawingUser(null);
      }
    });
  }, []);

  function startTimer() {
    socket.emit("startTimer");
  };

  return (

    <div>

      <Time minutes={timeM} seconds={timeS} />

      <button onClick={startTimer}>Start Timer</button>

      <div className="whiteboard">
          <CollabCanvas socket={socket} drawingUser={drawingUser} />
      </div>

    </div>
  );
};
