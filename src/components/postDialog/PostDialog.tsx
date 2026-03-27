import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { Post } from "../../types/post";
import DialogContent from "../dialog/Dialog";
import styles from "./postDialog.module.css";
import PostForm from "./postForm/consts.ts";

interface PostDialogProps {
  open: boolean;
  onClose: () => void;
  post?: Post;
  onSubmit: (post: Post) => void;
}

export const PostDialog = ({
  open,
  onClose,
  post,
  onSubmit,
}: PostDialogProps) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className={styles.titleWrapper}>
          <DialogPrimitive.Title className={styles.title}>
            {post ? "Edit Post" : "Create New Post"}
          </DialogPrimitive.Title>
        </div>

        <PostForm onClose={onClose} onSubmit={onSubmit} post={post} />
      </DialogContent>
    </DialogPrimitive.Root>
  );
};
