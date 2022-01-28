import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import paper from 'paper';
import { Link } from 'react-router-dom';
import Eraser from '../../assets/eraser.png';
import { Button } from '../../components/Button/Button';
import { DOMAIN } from '../../constants';

const CollabCanvas = ({
  socket,
  id,
  studyname,
  data,
  setData,
  pathsToSend,
  setPathsToSend
}: {
  socket: any;
  id: string;
  studyname: string;
  data: any;
  setData: (data: any) => void;
  pathsToSend: Array<any>;
  setPathsToSend: (p: any) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [canvasClass, setCanvasClass] = useState('penSelected');
  const [paths, setPaths] = useState<Array<any>>([]);
  const [started, setStarted] = useState(false);
  const [timerVal, setTimerVal] = useState(0);
  const router = useHistory();

  useEffect(() => {
    if (data) {
      setTimerVal(data.timer);
      const filteredPaths = data.paths.filter((obj:any) => obj.path)
      setPaths(filteredPaths);
      console.log(data.paths)
      for (const pathItem of filteredPaths) {
        const newPath = new paper.Path(pathItem.path[1]);
        newPath.strokeColor = new paper.Color(
          pathItem.path[1].strokeColor[0] === 0 ? '#000' : '#fff'
        );
      }
    }
  }, [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    paper.setup(canvas || 'myCanvas');
    socket.emit('startCanvas', id);
  }, [id, socket]);

  useEffect(() => {
    let myPath: paper.Path;
    let timeStamps: Array<any> = [];

    paper.view.onMouseDown = (event: any) => {
      myPath = new paper.Path();
      myPath.strokeColor = new paper.Color(color);
      myPath.strokeWidth = strokeWidth;
      myPath.add(event.point);
      timeStamps.push(event.timeStamp);
    };

    paper.view.onMouseDrag = (event: any) => {
      if (!myPath) {
        myPath = new paper.Path();
        myPath.strokeColor = new paper.Color(color);
        myPath.strokeWidth = strokeWidth;
      }
      myPath.add(event.point);
      timeStamps.push(event.timeStamp);
    };

    paper.view.onMouseUp = () => {
      // console.log(myPath);
      setPaths([
        ...paths,
        {
          path: myPath,
          id: studyname,
          time: Date.now(),
          timeStamps: timeStamps
        }
      ]);
      setPathsToSend([
        ...pathsToSend,
        {
          path: myPath,
          id: studyname,
          time: Date.now(),
          timeStamps: timeStamps
        }
      ]);
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
  }, [color, id, paths, pathsToSend, setPathsToSend, strokeWidth, studyname]);

  const handleSketchStart = () => {
    setStarted(true);
    const timerInt = setInterval(() => {
      setTimerVal((curr) => {
        if (curr % 10 === 0) {
          setPathsToSend((pathsToSend: any) => {
            if (pathsToSend.length > 0) {
              setData({ ...data, paths: pathsToSend });
            }
            return pathsToSend;
          });
        }
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
            onClick={() => {
              setCanvasClass('eraserSelected');
              setColor('#fff');
              setStrokeWidth(10);
            }}
            style={{
              backgroundImage: `url(${Eraser})`,
              backgroundSize: 'contain'
            }}
          ></div>
          <div
            className='colorIcon'
            onClick={() => {
              setCanvasClass('penSelected');
              setColor('#000');
              setStrokeWidth(5);
            }}
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
                {timerVal ? (
                  <Button
                    text='Start Sketching'
                    variant='dark'
                    onClick={handleSketchStart}
                  />
                ) : (
                  <Button
                    text='View Sketch'
                    variant='dark'
                    onClick={() => {
                      router.push('/view/' + id);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )}
        <canvas
          id='myCanvas'
          className={canvasClass}
          ref={canvasRef}
          data-paper-resize
        ></canvas>
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
  const [pathsToSend, setPathsToSend] = useState<Array<any>>([]);

  useEffect(() => {
    const roomId = sessionStorage.getItem('studycode');
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(DOMAIN + '/api/get/' + roomId, requestOptions)
      .then((res) => res.json())
      .then((d) => {
        console.log(d);
        setData(d);
      });
  }, [id, router, socket]);

  const updateSession = (data: any) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    fetch(DOMAIN + '/api/append', requestOptions).then((res) => {
      setPathsToSend([]);
    });
  };

  return (
    <div className='whiteboard'>
      <CollabCanvas
        socket={socket}
        id={id}
        studyname={studyname}
        data={data}
        setData={updateSession}
        pathsToSend={pathsToSend}
        setPathsToSend={setPathsToSend}
      />
    </div>
  );
};
