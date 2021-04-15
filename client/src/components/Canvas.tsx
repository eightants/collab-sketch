import paper from "paper";
import io from "socket.io-client";
import React, { useEffect, useRef } from "react";

export const CollabCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let myPath: paper.Path;
    const socket = io("http://localhost:3001");
    const canvas = canvasRef.current;
    paper.setup(canvas || "myCanvas");

    paper.view.onMouseDown = (event: any) => {
      myPath = new paper.Path();
      myPath.strokeColor = new paper.Color(0, 0, 0);
      myPath.add(event.point);
    };

    paper.view.onMouseDrag = (event: any) => {
      myPath.add(event.point);
    };

    paper.view.onMouseUp = () => {
      console.log(myPath);
      socket.emit("drawPath", myPath);
    };

    socket.on("turnStart", (drawingUser: any) => {
        console.log("Drawing: " + socket.id + " -- ");
    });

    socket.on("path", (path: paper.Path) => new paper.Path(path));

    return () => {
      socket.disconnect();
    };
  }, []);

  return <canvas id="myCanvas" ref={canvasRef} data-paper-resize></canvas>;
};
