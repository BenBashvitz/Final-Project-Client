import { Button } from "../../../components/button/Button";
import { Plus, Sparkles } from "lucide-react";
import styles from "./noPosts.module.css";

type NoPostsProps = {
  onCreatePost: () => void;
};

const NoPosts = ({ onCreatePost }: NoPostsProps) => {
  return (
    <div className={styles.container}>
      <Sparkles className={styles.icon} />
      <p className={styles.title}>No Posts Yet</p>
      <p className={styles.subtitle}>Be the first to share something!</p>
      <Button onClick={onCreatePost} className={styles.createButton}>
        <Plus className={styles.plusIcon} />
        Create Post
      </Button>
    </div>
  );
};

export default NoPosts;
