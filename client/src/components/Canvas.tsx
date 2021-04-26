import paper from "paper";
import React, { useEffect, useRef } from "react";

export const CollabCanvas = ({ socket, id, drawingUser }: { socket: any; id: string, drawingUser: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null); // Is useRef needed here?

  useEffect(() => {
    const canvas = canvasRef.current;
    paper.setup(canvas || "myCanvas");
    socket.emit("startCanvas", id);
  }, [id]);

  useEffect(()=> {
    console.log(drawingUser === socket.id);

    if (drawingUser === socket.id) {
      let myPath: paper.Path;

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
    }
  }, [id, drawingUser]);

  useEffect(() => {
    socket.on("path", (path: paper.Path) => {
      console.log(path);
      new paper.Path(path);
    });
  }, []);

  return <canvas id="myCanvas" ref={canvasRef} data-paper-resize></canvas>;
};
