import paper from "paper";
import React, { useEffect, useRef } from "react";

export const CollabCanvas = ({ socket } : {socket: any}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect((socket) => {
    let myPath: paper.Path;
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

    socket.on("path", (path: paper.Path) => new paper.Path(path));

    return () => {
      socket.disconnect(); // should this be moved somewhere else?
    };
  }, []);

  return <canvas id="myCanvas" ref={canvasRef} data-paper-resize></canvas>;
};
