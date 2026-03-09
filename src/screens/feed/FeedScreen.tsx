import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getPosts } from "../../services/posts-api";
import type { Cursor } from "../../types/cursor";
import type { Post } from "../../types/post";
import styles from "./feedScreen.module.css";
import NoPosts from "./noPosts/noPosts";
import { PostCard } from "./postCard/PostCard";
import axios from "axios";

interface FeedScreenProps {
  currentUserId: number;
}

const FeedScreen = ({ currentUserId }: FeedScreenProps) => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCursor, setCurrentCursor] = useState<Cursor | null>(null);

  useEffect(() => {
    const { response, abort } = getPosts(null);
    response
      .then(({ data: { posts, nextCursor } }) => {
        setAllPosts(posts);
        setCurrentCursor(nextCursor);
        setIsLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Failed to fetch posts:", error);
          setError("Failed to fetch movies");
          setIsLoading(false);
        }
      });

    return () => abort();
  }, [currentUserId]);

  const handlePostCreation = () => {};

  const fetchMorePosts = async () => {
    const { response } = getPosts(currentCursor);
    const {
      data: { posts, nextCursor },
    } = await response;

    setAllPosts((prevPosts) => [...prevPosts, ...posts]);
    setCurrentCursor(nextCursor);
  };

  return (
    <>
      {isLoading ? (
        <div>Loading feed page...</div>
      ) : allPosts.length === 0 ? (
        <NoPosts onCreatePost={handlePostCreation} />
      ) : (
        <InfiniteScroll
          hasMore={!!currentCursor?.creationDate}
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
          {error && <div className={styles.error}>Error: {error}</div>}
        </InfiniteScroll>
      )}
    </>
  );
};

export default FeedScreen;
