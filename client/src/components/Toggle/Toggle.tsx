import React, { ChangeEventHandler } from "react";
import styles from "./Toggle.module.css";

export const Toggle = ({
  value,
  onChange = () => {}
}: {
  value: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) => (
  <div className={styles.toggleDiv}>
    <label className={styles.switch}>
      <input type="checkbox" checked={value} onChange={onChange} />
      <span className={styles.slider}></span>
    </label>
  </div>
);
