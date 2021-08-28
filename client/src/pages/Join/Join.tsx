import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import styles from './Join.module.css';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    bottom: '10px',
  },
}));

export const Join = ({ socket }: { socket: any }) => {
  const classes = useStyles();
  const [enteredID, setEnteredID] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState({
    message: '',
    show: false
  });
  const { id } = useParams<{ id: string }>();
  const router = useHistory();

  useEffect(() => {
    if (id) {
      setEnteredID(id);
    }
    socket.on('joinedLobby', () => {
      router.push(`/lobby/${enteredID}`);
    });
    socket.on('joinedStartedLobby', () => {
      router.push(`/draw/${enteredID}`);
    });
    socket.on('gameStarted', () => {
      router.push(`/draw/${enteredID}`);
    });

    socket.on('error', (e: any) => {
      setError({ show: true, message: e.message });
      setTimeout(() => {
        setError({ show: false, message: '' });
      }, 2000);
    });
  }, [enteredID, id, router, socket]);

  const handleJoinLobby = () => {
    console.log(enteredID);
    window.sessionStorage.setItem("room", enteredID)
    socket.emit('onJoinLobby', { id: enteredID, nickname: nickname });
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.joinContent}>
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={'Enter nickname'}
        />
        <Input
          value={enteredID}
          onChange={(e) => setEnteredID(e.target.value)}
          placeholder={'Enter lobby code'}
        />
        <Button text='Join Session' variant='dark' onClick={handleJoinLobby} />
        <Link to='/'>
          <Button text='Back' />
        </Link>
      </div>
      {error.show && <Alert severity="error" className={classes.root}>{error.message}</Alert>}
    </div>
  );
};
