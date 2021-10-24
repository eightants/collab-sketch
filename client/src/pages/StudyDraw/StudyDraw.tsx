import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import paper from 'paper';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button/Button';

const CollabCanvas = ({
  socket,
  id,
  studyname,
  data,
  setData
}: {
  socket: any;
  id: string;
  studyname: string;
  data: any;
  setData: (data: any) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000');
  const [paths, setPaths] = useState<Array<any>>([]);
  const [started, setStarted] = useState(false);
  const [timerVal, setTimerVal] = useState(0);

  useEffect(() => {
    if (data) {
      setTimerVal(data.timer);
      setPaths(data.paths);
      for (const pathItem of data.paths) {
        const newPath = new paper.Path(pathItem.path[1]);
        newPath.strokeColor = new paper.Color('#000');
      }
    }
  }, [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    paper.setup(canvas || 'myCanvas');
    socket.emit('startCanvas', id);
  }, [color, id, socket]);

  useEffect(() => {
    let myPath: paper.Path;

    paper.view.onMouseDown = (event: any) => {
      myPath = new paper.Path();
      myPath.strokeColor = new paper.Color(color);
      myPath.add(event.point);
    };

    paper.view.onMouseDrag = (event: any) => {
      myPath.add(event.point);
    };

    paper.view.onMouseUp = () => {
      console.log(myPath);
      setPaths([...paths, { path: myPath, id: studyname, time: Date.now() }]);
    };

    const handleUndo = (event: any) => {
      if (event.ctrlKey && event.key === 'z') {
        if (paths.length) {
          const mostRecent = paths[paths.length - 1];
          if (mostRecent.id === studyname) {
            mostRecent.path.remove();
          }
          setPaths((paths) => paths.slice(0, paths.length - 1));
        }
      }
    };

    document.addEventListener('keydown', handleUndo);
    return () => {
      document.removeEventListener('keydown', handleUndo);
    };
  }, [color, id, paths, studyname]);

  const handleSketchStart = () => {
    setStarted(true);
    const timerInt = setInterval(() => {
      setTimerVal((curr) => {
        if (curr <= 0) {
          clearInterval(timerInt);
          handleSketchEnd();
          return 0;
        }
        return curr - 1;
      });
    }, 1000);
  };

  const handleSketchEnd = () => {
    setStarted(false);
    setPaths((paths) => {
      setData({ ...data, paths: paths });
      return paths;
    });
  };

  return (
    <div className='drawPage'>
      <div className='leftSidebar'>
        <Link style={{ textDecoration: 'none' }} to='/'>
          <div className='drawingTools'>
            <h2 className='iconText'>CSketch Session</h2>
          </div>
        </Link>
        <div className='drawingTools'>
          <div
            className='colorIcon'
            onClick={() => setColor('#c4c4c4')}
            style={{ backgroundColor: '#c4c4c4' }}
          ></div>
          <div
            className='colorIcon'
            onClick={() => setColor('#808080')}
            style={{ backgroundColor: '#808080' }}
          ></div>
          <div
            className='colorIcon'
            onClick={() => setColor('#424242')}
            style={{ backgroundColor: '#424242' }}
          ></div>
          <div
            className='colorIcon'
            onClick={() => setColor('#000')}
            style={{ backgroundColor: '#000' }}
          ></div>
        </div>
        {data && (
          <div className='prompt'>
            <strong>Prompt: </strong>
            {data.prompt}
          </div>
        )}
        <div className='prompt'>
          <strong>Time Remaining (s): </strong>
          {timerVal}
        </div>
      </div>
      <div className='canvasDiv'>
        {!started && (
          <div className='overlay'>
            {data && (
              <div>
                <div className='promptDiv'>{data.prompt}</div>
                <Button
                  text='Start Sketching'
                  variant='dark'
                  onClick={handleSketchStart}
                />
              </div>
            )}
          </div>
        )}
        <canvas id='myCanvas' ref={canvasRef} data-paper-resize></canvas>
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

export const StudyDraw = ({ socket }: { socket: any }) => {
  const id = window.sessionStorage.getItem('studycode') || '';
  const studyname = window.sessionStorage.getItem('studyname') || '';
  const router = useHistory();
  const [data, setData] = useState<sessionData>();

  useEffect(() => {
    const roomId = sessionStorage.getItem('studycode');
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('http://localhost:3001/api/get/' + roomId, requestOptions)
      .then((res) => res.json())
      .then((d) => {
        console.log(d);
        setData(d);
      });
    // window.sessionStorage.setItem('studycode', '');
  }, [id, router, socket]);

  const updateSession = (data: any) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    fetch('http://localhost:3001/api/create', requestOptions).then((res) => {});
  };

  return (
    <div className='whiteboard'>
      <CollabCanvas
        socket={socket}
        id={id}
        studyname={studyname}
        data={data}
        setData={updateSession}
      />
    </div>
  );
};
