import paper from 'paper';
import React, { useEffect, useRef } from 'react';
import { Users } from './Users/Users';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const CollabCanvas = ({ socket, id }: { socket: any; id: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000');

  useEffect(() => {
    const canvas = canvasRef.current;
    paper.setup(canvas || 'myCanvas');
    socket.emit('startCanvas', id);
    socket.on('path', (path: paper.Path) => {
      new paper.Path(path);
    });
  }, [id, socket]);

  useEffect(() => {
    let myPath: paper.Path;

    paper.view.onMouseDown = (event: any) => {
      myPath = new paper.Path();
      console.log(color);
      myPath.strokeColor = new paper.Color(color);
      myPath.add(event.point);
    };

    paper.view.onMouseDrag = (event: any) => {
      myPath.add(event.point);
    };

    paper.view.onMouseUp = () => {
      console.log(myPath);
      socket.emit('drawPath', { data: myPath, id });
    };
  }, [color, id, socket]);

  return (
    <div className='drawPage'>
      <div className='leftSidebar'>
        <Link style={{ textDecoration: 'none' }} to='/'>
          <div className='drawingTools'>
            <h2 className='iconText'>Collaborative Sketching</h2>
          </div>
        </Link>
        <div className='drawingTools'>
          <div className='colorIcon' onClick={()=> setColor("#c4c4c4")} style={{backgroundColor: "#c4c4c4"}}></div>
          <div className='colorIcon' onClick={()=> setColor("#808080")} style={{backgroundColor: "#808080"}}></div>
          <div className='colorIcon' onClick={()=> setColor("#424242")} style={{backgroundColor: "#424242"}}></div>
          <div className='colorIcon' onClick={()=> setColor("#000")} style={{backgroundColor: "#000"}}></div>
        </div>
        <Users socket={socket} />
      </div>
      <canvas id='myCanvas' ref={canvasRef} data-paper-resize></canvas>
    </div>
  );
};
