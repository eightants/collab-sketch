import React, { MouseEventHandler } from "react";
import styles from "./Button.module.css";

export const Button = ({
  text,
  variant = "light",
  width = "100%",
  onClick = () => {}
}: {
  text: string;
  variant?: "light" | "dark";
  width?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) => (
  <div className={styles.btnDiv} style={{ width: width }}>
    <button
      className={variant === "light" ? styles.btnLight : styles.btnDark}
      onClick={onClick}
    >
      <span>{text}</span>
    </button>
  </div>
);
