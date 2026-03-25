import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/button/Button";
import { PostDialog } from "../../../components/postDialog/PostDialog.tsx";
import type { Post } from "../../../types/post";
import styles from "./noPosts.module.css";

type NoPostsProps = {
  onCreatePost: (post: Post) => void;
};

const NoPosts = ({ onCreatePost }: NoPostsProps) => {
  const [showPostCreationDialog, setShowPostCreationDialog] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <Sparkles className={styles.icon} />
        <p className={styles.title}>No Posts Yet</p>
        <p className={styles.subtitle}>Be the first to share something!</p>
        <Button
          onClick={() => setShowPostCreationDialog(true)}
          className={styles.createButton}
        >
          <Plus className={styles.plusIcon} />
          Create Post
        </Button>
      </div>
      <PostDialog
        open={showPostCreationDialog}
        onClose={() => setShowPostCreationDialog(false)}
        onSubmit={onCreatePost}
      />
    </>
  );
};

export default NoPosts;
