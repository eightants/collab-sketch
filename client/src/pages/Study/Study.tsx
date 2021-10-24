import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import styles from '../Join/Join.module.css';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';

export const Study = ({ socket }: { socket: any }) => {
  const [enteredID, setEnteredID] = useState('');
  const [nickname, setNickname] = useState('');
  const { id } = useParams<{ id: string }>();
  const router = useHistory();

  useEffect(() => {
    if (id) {
      setEnteredID(id);
    }
  }, [id]);

  const handleJoinLobby = () => {
    sessionStorage.setItem("studycode", enteredID);
    sessionStorage.setItem("studyname", nickname);
    router.push('/studydraw');
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.joinContent}>
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={'Enter participant ID'}
        />
        <Input
          value={enteredID} 
          onChange={(e) => setEnteredID(e.target.value)}
          placeholder={'Enter study code'}
          disabled={id ? true : false}
        />
        <Button text='Start Study' variant='dark' onClick={handleJoinLobby} />
        <Link to='/'>
          <Button text='Back' />
        </Link>
      </div>
    </div>
  );
};
