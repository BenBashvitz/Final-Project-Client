import {Home, UserIcon} from "lucide-react";
import {useState} from "react";
import styles from "./feedScreen.module.css";
import Feed from "../../components/feed/Feed.tsx";

const FeedScreen = () => {
  const [myPostsSelected, setMyPostsSelected] = useState(false);

  const handleMyPostsSelection = () => {
    setMyPostsSelected(true);
  };

  const handleAllPostsSelection = () => {
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
