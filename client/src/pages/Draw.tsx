import React from "react";
import { CollabCanvas } from "../components/Canvas";
import { Timer } from "../components/DrawTimer"

export const Draw = () => {

    // const socket = io("http://localhost:3000");

    function startTimer() {
        // socket.emit("startTimer");
    };

    return (

        <div>

            <Timer minutes={0} seconds={25}/>

            <button onClick={startTimer}>Start Timer</button>

            <div className="whiteboard">
                <CollabCanvas />
            </div>

        </div>
  );
};
