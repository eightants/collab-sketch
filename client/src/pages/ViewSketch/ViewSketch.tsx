import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import paper from 'paper';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { DOMAIN } from '../../constants';

export const ViewSketch = ({ socket }: { socket: any }) => {
  const router = useHistory();
  const [data, setData] = useState<sessionData>();
  const { id } = useParams<{ id: string }>();
  const [, setCurrPath] = useState(0);
  const [clearCanvasTrigger, setClearCanvasTrigger] = useState(false);
  const [timerVar, setTimerVar] = useState(setInterval(() => {}, 100));

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(DOMAIN + '/api/get/' + id, requestOptions)
      .then((res) => res.json())
      .then((d) => {
        console.log(d);
        setData(d);
      });
  }, [id, router, socket]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startReplay = () => {
    if (data) {
      const filteredPaths = data.paths.filter((obj:any) => obj.path)
      const timerInt = setInterval(() => {
        setCurrPath((curr) => {
          if (curr >= filteredPaths.length) {
            clearInterval(timerInt);
            return 0;
          }
          const newPath = new paper.Path(filteredPaths[curr].path[1]);
          newPath.strokeColor = new paper.Color(
            filteredPaths[curr].path[1].strokeColor[0] === 0 ? '#000' : '#fff'
          );
          return curr + 1;
        });
      }, 100);
      setTimerVar(timerInt);
    }
  };

  const clearCanvas = () => {
    if (data) {
      clearInterval(timerVar);
      setClearCanvasTrigger(true);
      setCurrPath(0);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    setClearCanvasTrigger(false);
    paper.setup(canvas || 'myCanvas');
  }, [clearCanvasTrigger]);

  return (
    <div className='whiteboard'>
      <div className='drawPage'>
        <div className='leftSidebar'>
          <Link style={{ textDecoration: 'none' }} to='/'>
            <div className='drawingTools'>
              <h2 className='iconText'>CSketch Session</h2>
            </div>
          </Link>
          {data && (
            <div className='prompt'>
              <strong>Prompt: </strong>
              {data.prompt}
            </div>
          )}
          <div className='prompt'>
            <Button text={'Start Replay'} onClick={startReplay} />
            <Button text={'Clear'} onClick={clearCanvas} />
          </div>
        </div>
        <div className='canvasDiv'>
          <div className='overlayView'></div>
          <canvas id='myCanvas' ref={canvasRef} data-paper-resize></canvas>
        </div>
      </div>
    </div>
  );
};

type sessionData = {
  _id: string;
  paths: Array<any>;
  prompt: string;
  timer: number;
};
