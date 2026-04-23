import InfiniteScroll from "react-infinite-scroll-component";
import { PostCard } from "../../components/postCard/PostCard";
import styles from "./feed.module.css";
import NoPosts from "./noPosts/NoPosts.tsx";
import useGetContext from "../../hooks/useGetContext.ts";
import { LoadedPostsContext } from "../../contexts/contexts.ts";
import CircularProgress from "@mui/material/CircularProgress";

type FeedProps = {
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
  initialFetchError: string | null;
  fetchMoreError: string | null;
};

const Feed = ({
  hasMore,
  onLoadMore,
  isLoading,
  initialFetchError,
  fetchMoreError,
}: FeedProps) => {
  const {
    posts,
    handleAddPost,
    handleEditPost,
    handleLikePost,
    handleDeletePost,
  } = useGetContext(LoadedPostsContext);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <CircularProgress aria-label="Loading…" />
      </div>
    );
  }

  if (initialFetchError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {initialFetchError}</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={styles.container}>
        <NoPosts onCreatePost={handleAddPost} />
      </div>
    );
  }

  return (
    <div id="scrollableTarget" className={styles.scrollContainer}>
      <InfiniteScroll
        className={styles.infiniteScroll}
        hasMore={hasMore}
        loader={
          !fetchMoreError && (
            <CircularProgress aria-label="Loading…" className={styles.loader} />
          )
        }
        endMessage={
          <div className={styles.text}>
            You have reached the end of the feed
          </div>
        }
        dataLength={posts.length}
        next={onLoadMore}
        scrollableTarget="scrollableTarget"
      >
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onEdit={handleEditPost}
            onDelete={() => handleDeletePost(post._id)}
            onLike={() => handleLikePost(post)}
          />
        ))}
        {fetchMoreError && (
          <div
            className={[styles.error, styles.text].filter(Boolean).join(" ")}
          >
            Error: {fetchMoreError}
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default Feed;
