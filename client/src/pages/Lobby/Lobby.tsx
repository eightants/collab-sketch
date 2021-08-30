import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styles from './Lobby.module.css';
import shared from '../../assets/shared.module.css';
import { Button } from '../../components/Button/Button';

export const Lobby = ({ socket }: { socket: any }) => {
  const router = useHistory();
  const { id } = useParams<{ id: string }>();
  const [isHost, setIsHost] = useState(false);
  const [lobbyUsers, setLobbyUsers] = useState<Array<any>>([]);

  useEffect(() => {
    socket.emit('checkPermissions', id);
    socket.on('roomError', () => {
      router.push('');
    });
    socket.on('isHost', (h: boolean) => setIsHost(h));

    socket.emit('onDrawJoin', id);
    socket.on('notJoined', (id: string) => {
      router.push(`/join/${id}`);
    });

    socket.on('kickedUser', () => {
      socket.emit('onLeave', id);
    });

    socket.on('leaveLobby', () => {
      if (isHost) {
        router.push('/create');
      } else {
        router.push('/join');
      }
    });

    socket.on('gameStarted', (id: string) => {
      console.log("pushed stet", id)
      router.push(`/draw/${id}`);
    });
  }, [id, isHost, router, socket]);

  useEffect(() => {
    socket.on('joinedLobby', (users: any) => {
      setLobbyUsers(users);
    });
  }, [socket]);

  const handleStart = () => {
    window.sessionStorage.setItem("room", id)
    socket.emit('onStartGame', id);
  };

  return (
    <div className={shared.mainContainer}>
      <div className={shared.mainContent}>
        {isHost ? (
          <div className={styles.playerDiv}>
            {lobbyUsers.length > 0
              ? lobbyUsers.map((user: any, ind: number) => (
                  <div key={ind} className={styles.playerRow}>
                    <div>{user.nickname}</div>
                    <div
                      className={styles.kickBtn}
                      onClick={() => socket.emit('kickUser', user.sid)}
                    >
                      Kick
                    </div>
                  </div>
                ))
              : 'Waiting for people to join...'}
          </div>
        ) : (
          <div className={styles.playerDiv}>
            Waiting for the host to start...
          </div>
        )}
        {isHost && (
          <Button text='Start Session' variant='dark' onClick={handleStart} />
        )}
        <Button text='Leave' onClick={() => socket.emit('onLeave', id)} />
      </div>
    </div>
  );
};
