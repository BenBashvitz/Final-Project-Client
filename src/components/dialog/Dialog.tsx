import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import styles from "./dialog.module.css";

const DialogContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) => {
  return (
    <DialogPrimitive.Portal data-slot="dialog-portal">
      <DialogPrimitive.Overlay className={styles.overlay} />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={[styles.content, className].filter(Boolean).join(" ")}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className={styles.closeButton}>
          <XIcon />
          <span className={styles.srOnly}>Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
};

export default DialogContent;
