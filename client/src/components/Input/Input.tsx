import React, { ChangeEventHandler } from "react";
import styles from "./Input.module.css";

export const Input = ({
  placeholder,
  width = "100%",
  value,
  onChange = () => {}
}: {
  placeholder?: string;
  width?: string;
  value: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) => (
  <div className={styles.btnDiv} style={{ width: width }}>
    <input
      className={styles.codeInput}
      value={value}
      placeholder={placeholder || "Enter text..."}
      onChange={onChange}
    />
  </div>
);
