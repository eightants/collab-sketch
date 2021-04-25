import React, { MouseEventHandler } from "react";
import styles from "./Button.module.css";

export const Button = ({
  text,
  variant = "light",
  width,
  onClick = () => {}
}: {
  text: string;
  variant?: "light" | "dark";
  width?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) => (
  <div className={styles.btnDiv}>
    <button
      className={variant === "light" ? styles.btnLight : styles.btnDark}
      onClick={onClick}
      style={width ? { width: width } : {}}
    >
      {text}
    </button>
  </div>
);
