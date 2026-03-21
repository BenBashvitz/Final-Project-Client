import React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import styles from "./avatar.module.css";

const Avatar = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) => {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={[styles.avatar, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
};

const AvatarImage = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) => {
  return (
    <AvatarPrimitive.Image
      className={[styles.avatarImage, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
};

const AvatarFallback = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={[styles.avatarFallback, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
};

export { Avatar, AvatarImage, AvatarFallback };
