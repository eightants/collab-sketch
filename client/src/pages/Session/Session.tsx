import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Join/Join.module.css';
import sessionStyles from './Session.module.css';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { DOMAIN } from '../../constants';
import { Alert } from '@material-ui/lab';

export const Session = () => {
  const [enteredID, setEnteredID] = useState('');
  const [timer, setTimer] = useState(300);
  const [prompt, setPrompt] = useState('');
  const [created, setCreated] = useState(false);

  const handleJoinLobby = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: enteredID,
        timer: timer,
        prompt: prompt,
        paths: []
      })
    };
    fetch(DOMAIN + '/api/create', requestOptions).then((res) => {
      setEnteredID('');
      setCreated(true);
    });
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.joinContent}>
        <div>Study Session ID</div>
        <Input
          value={enteredID}
          onChange={(e) => setEnteredID(e.target.value)}
          placeholder={'Enter study code'}
        />
        <div>Timer Duration</div>
        <Input
          value={timer}
          onChange={(e) => setTimer(parseInt(e.target.value) || 300)}
          placeholder={'Enter timer duration (seconds)'}
        />
        <div>Sketching Prompt</div>
        <textarea
          className={sessionStyles.prompt}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={'Enter prompt...'}
        ></textarea>
        <Button text='Create Study' variant='dark' onClick={handleJoinLobby} />
        <Link to='/'>
          <Button text='Back' />
        </Link>
        {created && <Alert severity='success'>Study Created!</Alert>}
      </div>
    </div>
  );
};
