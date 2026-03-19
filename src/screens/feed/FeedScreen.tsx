import { useEffect, useState, type JSX } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { deletePost, getPosts } from "../../services/posts-api";
import type { Cursor } from "../../types/post";
import type { Post } from "../../types/post";
import styles from "./feedScreen.module.css";
import NoPosts from "./noPosts/NoPosts";
import { PostCard } from "./postCard/PostCard";
import axios from "axios";

const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
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
        setPosts(posts);
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

  const fetchMorePosts = async () => {
    try {
      const { response } = getPosts(currentCursor);
      const {
        data: { posts, cursor },
      } = await response;

      setPosts((prevPosts) => prevPosts.concat(posts));
      setCurrentCursor(cursor);
    } catch (error) {
      console.error("Failed to fetch more posts:", error);
      setFetchMoreError("Failed to fetch more posts");
    }
  };

  const getContent = (): JSX.Element => {
    if (isLoading) {
      return (
        <div className={styles.container}>
          <div>Loading feed page...</div>
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
          <NoPosts
            onCreatePost={(post) => setPosts((prev) => [post, ...prev])}
          />
        </div>
      );
    }

    const handleEditPost = (editedPost: Post) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === editedPost._id ? { ...post, ...editedPost } : post,
        ),
      );
    };

    const handleDeletePost = async (postId: Post["_id"]) => {
      try {
        const { _id } = await deletePost(postId);
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== _id));
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    };

    return (
      <InfiniteScroll
        className={styles.infiniteScroll}
        hasMore={!!currentCursor}
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
          <PostCard
            key={post._id}
            post={post}
            onEdit={handleEditPost}
            onDelete={() => handleDeletePost(post._id)}
          />
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
