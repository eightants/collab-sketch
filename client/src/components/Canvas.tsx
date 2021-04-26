import paper from "paper";
import React, { useEffect, useRef } from "react";

export const CollabCanvas = ({ socket, id }: { socket: any; id: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let myPath: paper.Path;
    const canvas = canvasRef.current;
    paper.setup(canvas || "myCanvas");
    socket.emit("startCanvas", id);

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
      socket.emit("drawPath", { data: myPath, id });
    };

    socket.on("path", (path: paper.Path) => {
      console.log("got path");
      new paper.Path(path);
    });
  }, [id, socket]);

  return <canvas id="myCanvas" ref={canvasRef} data-paper-resize></canvas>;
};
