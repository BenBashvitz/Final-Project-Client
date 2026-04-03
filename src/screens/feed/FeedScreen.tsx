import { Home, UserIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { Cursor } from "../../types/post";
import styles from "./feedScreen.module.css";
import Feed from "../../components/feed/Feed.tsx";

const FeedScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentCursor, setCurrentCursor] = useState<Cursor | null>(null);
  const [myPostsSelected, setMyPostsSelected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTabSelection = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    setIsLoading(true);
    setCurrentCursor(null);
  };

  const handleMyPostsSelection = () => {
    handleTabSelection();
    setMyPostsSelected(true);
  };

  const handleAllPostsSelection = () => {
    handleTabSelection();
    setMyPostsSelected(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${!myPostsSelected ? styles.active : ""}`}
          onClick={() => myPostsSelected && handleAllPostsSelection()}
        >
          <Home className={styles.icon} />
          All Posts
        </div>
        <div
          className={`${styles.tab} ${myPostsSelected ? styles.active : ""}`}
          onClick={() => !myPostsSelected && handleMyPostsSelection()}
        >
          <UserIcon className={styles.icon} />
          My Posts
        </div>
      </div>
      <Feed myPostsSelected={myPostsSelected} initialIsLoading={isLoading} initialCurrentCursor={currentCursor} />
    </div>
  );
};

export default FeedScreen;
