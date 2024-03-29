import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import mainImg from '../../assets/clumsy.svg';
import { Button } from '../../components/Button/Button';

export const Home = ({ socket }: { socket: any }) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.homeContent}>
        <div className={styles.titleDiv}>
          <div>
            <img src={mainImg} alt='Person with loose paper flying around' />
          </div>
          <h1 className={styles.mainTitle}>Collaborative Sketching</h1>
        </div>
        <div>
          <Link to='/join'>
            <Button text='Join Lobby' width='200px' variant='dark' />
          </Link>
          <Link to='/create'>
            <Button text='Create Lobby' width='200px' />
          </Link>
        </div>
        <div>
          <Link to='/study'>
            <Button text='Experimental' width='200px' />
          </Link>
        </div>
      </div>
    </div>
  );
};
