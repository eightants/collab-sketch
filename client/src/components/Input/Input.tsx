import React, { ChangeEventHandler } from "react";
import styles from "./Input.module.css";

export const Input = ({
  placeholder,
  width = "100%",
  value,
  disabled = false,
  onChange = () => {}
}: {
  placeholder?: string;
  width?: string;
  value: string | number;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) => (
  <div className={styles.btnDiv} style={{ width: width }}>
    <input
      className={styles.codeInput}
      value={value}
      placeholder={placeholder || "Enter text..."}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);
