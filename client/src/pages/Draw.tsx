import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { CollabCanvas } from '../components/Canvas';

export const Draw = ({ socket }: { socket: any }) => {
  const id = window.sessionStorage.getItem("room") || "";
  const router = useHistory();

  useEffect(() => {
    socket.emit('onDrawJoinStarted', id);
    socket.on('notJoinedStarted', (id: string) => {
      router.push(`/join/${id}`);
    });
    return () => {
      socket.off('notJoinedStarted', () => {});
    };
  }, [id, router, socket]);

  return (
    <div className='whiteboard'>
      <CollabCanvas socket={socket} id={id} />
    </div>
  );
};
