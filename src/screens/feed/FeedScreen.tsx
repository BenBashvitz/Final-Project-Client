import { useEffect, useState, type JSX } from "react";
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<Cursor | null>(null);

  useEffect(() => {
    const { response, abort } = getPosts(null);
    response
      .then(({ data: { posts, nextCursor } }) => {
        setPosts(posts);
        setCursor(nextCursor);
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

  const fetchMorePosts = async () => {
    const { response } = getPosts(cursor);
    const {
      data: { posts, nextCursor },
    } = await response;

    setPosts((prevPosts) => [...prevPosts, ...posts]);
    setCursor(nextCursor);
  };

  const getContent = (): JSX.Element => {
    if (isLoading) {
      return <div>Loading feed page...</div>;
    }

    if (error) {
      return <div className={styles.error}>Error: {error}</div>;
    }

    if (posts.length === 0) {
      return (
        <NoPosts onCreatePost={(post) => setPosts((prev) => [post, ...prev])} />
      );
    }

    return (
      <InfiniteScroll
        hasMore={!!cursor?.creationDate}
        loader={<div>loading...</div>}
        endMessage={
          <div className={styles.endMessage}>
            You have reached the end of the feed
          </div>
        }
        dataLength={posts.length}
        next={fetchMorePosts}
      >
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
        {error && <div className={styles.error}>Error: {error}</div>}
      </InfiniteScroll>
    );
  };

  return getContent();
};

export default FeedScreen;
