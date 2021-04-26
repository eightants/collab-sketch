import React, { ChangeEventHandler } from "react";
import styles from "./Input.module.css";

export const Input = ({
  placeholder,
  value,
  onChange = () => {}
}: {
  placeholder?: string;
  value: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) => (
  <div className={styles.btnDiv}>
    <input
      className={styles.codeInput}
      value={value}
      placeholder={placeholder || "Enter text..."}
      onChange={onChange}
    />
  </div>
);
