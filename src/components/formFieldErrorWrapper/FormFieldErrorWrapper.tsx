import type { PropsWithChildren } from "react";
import styles from "./formFieldErrorWrapper.module.css";

type FormFieldErrorWrapperProps = PropsWithChildren<{
  error?: string;
}>;

const FormFieldErrorWrapper = ({
  children,
  error,
}: FormFieldErrorWrapperProps) => (
  <div className={styles.wrapper}>
    {children}
    {error && <div className={styles.error}>{error}</div>}
  </div>
);

export default FormFieldErrorWrapper;
