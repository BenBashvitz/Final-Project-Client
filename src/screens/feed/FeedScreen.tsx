import axios from "axios";
import { Home, UserIcon } from "lucide-react";
import { type JSX, useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PostCard } from "../../components/postCard/PostCard";
import {
  CurrentUserContext,
  LoadedPostsContext,
} from "../../contexts/contexts.ts";
import useGetContext from "../../hooks/useGetContext.ts";
import { likePost, unlikePost } from "../../services/likes-api";
import { deletePost, getPosts } from "../../services/posts-api";
import type { Cursor, Post } from "../../types/post";
import { mergeItems } from "../../utils/merge";
import styles from "./feedScreen.module.css";
import NoPosts from "./noPosts/NoPosts.tsx";

const FeedScreen = () => {
  const { posts, setPosts } = useGetContext(LoadedPostsContext);
  const { currentUser } = useGetContext(CurrentUserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [initialFetchError, setInitialFetchError] = useState<string | null>(
    null,
  );
  const [fetchMoreError, setFetchMoreError] = useState<string | null>(null);
  const [currentCursor, setCurrentCursor] = useState<Cursor | null>(null);
  const [myPostsSelected, setMyPostsSelected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { response, abort } = myPostsSelected
      ? getPosts(currentCursor ?? undefined, currentUser?._id)
      : getPosts(currentCursor ?? undefined);
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

    return abort;
  }, [myPostsSelected]);

  const fetchMorePosts = async () => {
    try {
      if (!currentCursor) {
        console.error("current cursor is null, cannot fetch more posts");
        setFetchMoreError("Failed to fetch more posts");
      } else {
        const { response } = myPostsSelected
          ? getPosts(currentCursor, currentUser?._id)
          : getPosts(currentCursor);
        const {
          data: { posts, cursor },
        } = await response;

        setPosts((prevPosts) => prevPosts.concat(posts));
        setCurrentCursor(cursor);
      }
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
            onCreatePost={(post) => setPosts((prev) => [post].concat(prev))}
          />
        </div>
      );
    }

    const handleEditPost = (editedPost: Post) => {
      setPosts((prevPosts) => mergeItems(prevPosts, editedPost));
    };

    const handleDeletePost = async (postId: Post["_id"]) => {
      try {
        const { _id } = await deletePost(postId);
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== _id));
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    };

    const handleLikePost = async (post: Post) => {
      try {
        const updatedPost = post.isLikedByCurrentUser
          ? await unlikePost(post._id)
          : await likePost(post._id);

        setPosts((prevPosts) => mergeItems(prevPosts, updatedPost));
      } catch (error) {
        console.error("Failed to like post:", error);
      }
    };

    return (
      <div
        ref={scrollRef}
        id="scrollableTarget"
        className={styles.scrollContainer}
      >
        <InfiniteScroll
          className={styles.infiniteScroll}
          hasMore={!!currentCursor}
          loader={<div className={styles.text}>loading...</div>}
          endMessage={
            <div className={styles.text}>
              You have reached the end of the feed
            </div>
          }
          dataLength={posts.length}
          next={fetchMorePosts}
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
          onClick={handleAllPostsSelection}
        >
          <Home className={styles.icon} />
          All Posts
        </div>
        <div
          className={`${styles.tab} ${myPostsSelected ? styles.active : ""}`}
          onClick={handleMyPostsSelection}
        >
          <UserIcon className={styles.icon} />
          My Posts
        </div>
      </div>
      {getContent()}
    </div>
  );
};

export default FeedScreen;
