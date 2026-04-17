import axios from "axios";
import {type JSX, useEffect, useRef, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {PostCard} from "../../components/postCard/PostCard";
import {CurrentUserContext, LoadedPostsContext,} from "../../contexts/contexts.ts";
import useGetContext from "../../hooks/useGetContext.ts";
import {getPosts} from "../../services/posts-api";
import type {Cursor} from "../../types/post";
import styles from "./feed.module.css";
import NoPosts from "./noPosts/NoPosts.tsx";

type FeedProps = {
    myPostsSelected: boolean,
}

const Feed = ({ myPostsSelected }: FeedProps) => {
    const {
        posts,
        setPosts,
        handleEditPost,
        handleDeletePost,
        handleLikePost
    } = useGetContext(LoadedPostsContext);
    const { currentUser } = useGetContext(CurrentUserContext);

    const [isLoading, setIsLoading] = useState(true);
    const [initialFetchError, setInitialFetchError] = useState<string | null>(
        null,
    );
    const [fetchMoreError, setFetchMoreError] = useState<string | null>(null);
    const [currentCursor, setCurrentCursor] = useState<Cursor | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToTop = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    };

    const fetchPosts = () => {
        return myPostsSelected
            ? getPosts(currentCursor ?? undefined, currentUser?._id)
            : getPosts(currentCursor ?? undefined);
    }

    useEffect(() => {
        scrollToTop();

        const { response, abort } = fetchPosts();

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

        return (
            <div
                ref={scrollRef}
                id="scrollableTarget"
                className={styles.scrollContainer}
            >
                <InfiniteScroll
                    className={styles.infiniteScroll}
                    hasMore={!!currentCursor}
                    loader={
                        !fetchMoreError && <div className={styles.text}>loading...</div>
                    }
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

    return (
        <>
            {getContent()}
        </>
    );
};

export default Feed;
