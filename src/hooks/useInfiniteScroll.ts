import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import type {Cursor, PostFetchFn} from "../types/post.ts";
import useGetContext from "./useGetContext.ts";
import {LoadedPostsContext} from "../contexts/contexts.ts";

export const useInfiniteFeed = (
    fetchFn: PostFetchFn,
    dependencies: unknown[] = []
) => {
    const {
        setPosts,
    } = useGetContext(LoadedPostsContext);
    const [cursor, setCursor] = useState<Cursor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchMoreError, setFetchMoreError] = useState<string | null>(null);
    const [initialFetchError, setInitialFetchError] = useState<string | null>(null);

    const loadInitial = useCallback(async () => {
        setIsLoading(true);
        setFetchMoreError(null);
        setInitialFetchError(null);
        setCursor(null);

        const {response, abort} = fetchFn();

        try {
            const {data: result} = await response;
            setPosts(result.posts);
            setCursor(result.cursor);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Request canceled:", error.message);
            } else {
                console.error("Failed to fetch posts:", error);
                setInitialFetchError("Failed to fetch posts")
            }
        } finally {
            setIsLoading(false);
        }

        return abort;
    }, dependencies);

    const loadMore = async () => {
        if (!cursor) {
            console.error("current cursor is null, cannot fetch more posts");
            setFetchMoreError("Failed to fetch more posts");
        } else {
            try {
                const {response} = fetchFn(cursor);
                const {data: result} = await response;
                setPosts((prevPosts) => prevPosts.concat(result.posts));
                setCursor(result.cursor);
            } catch (error) {
                console.error("Failed to fetch more posts:", error);
                setFetchMoreError("Failed to fetch more posts");
            }
        }
    };

    useEffect(() => {
        loadInitial();
    }, [loadInitial]);

    return {cursor, isLoading, fetchMoreError, initialFetchError, loadMore};
};