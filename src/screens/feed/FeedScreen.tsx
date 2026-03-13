import { useEffect, useState, type JSX } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getPosts } from "../../services/posts-api";
import type { Cursor } from "../../types/post";
import type { Post } from "../../types/post";
import styles from "./feedScreen.module.css";
import NoPosts from "./noPosts/noPosts";
import { PostCard } from "./postCard/PostCard";
import axios from "axios";

const FeedScreen = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialFetchError, setInitialFetchError] = useState<string | null>(
    null,
  );
  const [fetchMoreError, setFetchMoreError] = useState<string | null>(null);
  const [currentCursor, setCurrentCursor] = useState<Cursor | null>(null);

  useEffect(() => {
    const { response, abort } = getPosts(null);
    response
      .then(({ data: { posts, cursor } }) => {
        setAllPosts(posts);
        setCurrentCursor(cursor);
        setIsLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Failed to fetch posts:", error);
          setInitialFetchError("Failed to fetch posts");
          setIsLoading(false);
        }
      });

    return () => abort();
  }, []);

  const handlePostCreation = () => {};

  const fetchMorePosts = async () => {
    try {
      const { response } = getPosts(currentCursor);
      const {
        data: { posts, cursor },
      } = await response;

      setAllPosts((prevPosts) => [...prevPosts, ...posts]);
      setCurrentCursor(cursor);
    } catch (error) {
      console.error("Failed to fetch more posts:", error);
      setFetchMoreError("Failed to fetch more posts");
    }
  };

  const getContent = (): JSX.Element => {
    if (isLoading) {
      return <div>Loading feed page...</div>;
    }

    if (initialFetchError) {
      return <div className={styles.error}>Error: {initialFetchError}</div>;
    }

    if (allPosts.length === 0) {
      return <NoPosts onCreatePost={handlePostCreation} />;
    }

    return (
      <InfiniteScroll
        hasMore={!!currentCursor}
        loader={<div>loading...</div>}
        endMessage={
          <div className={styles.endMessage}>
            You have reached the end of the feed
          </div>
        }
        dataLength={allPosts.length}
        next={fetchMorePosts}
      >
        {allPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
        {fetchMoreError && (
          <div className={styles.error}>Error: {fetchMoreError}</div>
        )}
      </InfiniteScroll>
    );
  };

  return getContent();
};

export default FeedScreen;
