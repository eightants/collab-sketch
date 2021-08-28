import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from "./Users.module.css";

export const Users = ({ socket }: { socket: any }) => {
  const { id } = useParams<{ id: string }>();
  const [lobbyUsers, setLobbyUsers] = useState<Array<any>>([]);
  
  useEffect(() => {
    socket.on("joinedStartedLobby", (users: any) => {
      setLobbyUsers(users);
    });

    socket.emit("getLobbyUsers", id)
    socket.on("lobbyUsers", (users: any) => {
      setLobbyUsers(users);
    });
  }, [id, socket]);

  return (
    <div className={styles.lobbyDiv}>
      <div><strong>Users</strong></div>
      {lobbyUsers.length > 0
        ? lobbyUsers.map((user: any, ind: number) => (
            <div key={ind}>
              <div>{user.nickname}</div>
            </div>
          ))
        : 'Host'}
    </div>
  );
};
