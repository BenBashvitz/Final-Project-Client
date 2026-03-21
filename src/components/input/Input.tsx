import styles from "./input.module.css";
import type { ComponentProps } from "react";

export const Input = ({ className, ...props }: ComponentProps<"input">) => {
  return (
    <input
      className={[styles.input, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
};
