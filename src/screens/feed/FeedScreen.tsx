import {Home, UserIcon} from "lucide-react";
import {useRef, useState} from "react";
import styles from "./feedScreen.module.css";
import Feed from "../../components/feed/Feed.tsx";

const FeedScreen = () => {
  const [myPostsSelected, setMyPostsSelected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTabSelection = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
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
      <Feed myPostsSelected={myPostsSelected} />
    </div>
  );
};

export default FeedScreen;
