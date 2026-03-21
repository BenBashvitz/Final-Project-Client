import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { Post } from "../../types/post";
import DialogContent from "../dialog/Dialog";
import styles from "./postDialog.module.css";
import PostForm from "./postForm/PostForm";

interface PostDialogProps {
  open: boolean;
  onClose: () => void;
  editPost?: Post;
  onCreatePost: (post: Post) => void;
}

export const PostDialog = ({
  open,
  onClose,
  editPost,
  onCreatePost,
}: PostDialogProps) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className={styles.titleWrapper}>
          <DialogPrimitive.Title className={styles.title}>
            {editPost ? "Edit Post" : "Create New Post"}
          </DialogPrimitive.Title>
        </div>

        <PostForm
          onClose={onClose}
          onCreatePost={onCreatePost}
          post={editPost}
        />
      </DialogContent>
    </DialogPrimitive.Root>
  );
};
