import React, { useState } from 'react';
import styles from './ColorPicker.module.css';
import { SketchPicker } from 'react-color';

export const ColorPicker = ({
  setColor
}: {
  setColor: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [state, setState] = useState({
    displayColorPicker: false,
    color: '#000'
  });

  const handleClick = () => {
    setState({ ...state, displayColorPicker: !state.displayColorPicker });
  };

  const handleClose = () => {
    setState({ ...state, displayColorPicker: false });
  };

  const handleChange = (color: any) => {
    setColor(color.hex);
    setState({ ...state, color: color.hex });
  };

  return (
    <div>
      <div className={styles.swatch} onClick={handleClick}>
        <div className={styles.color} style={{backgroundColor: state.color }} />
      </div>
      {state.displayColorPicker ? (
        <div className={styles.popover}>
          <div className={styles.cover} onClick={handleClose} />
          <SketchPicker color={state.color} onChange={handleChange}/>
        </div>
      ) : null}
    </div>
  );
};
