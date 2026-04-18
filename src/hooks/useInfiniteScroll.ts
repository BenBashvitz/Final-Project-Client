import {useCallback, useEffect, useState} from "react";
import axios, {type AxiosResponse} from "axios";
import type {Cursor, PostPage} from "../types/post.ts";
import useGetContext from "./useGetContext.ts";
import {LoadedPostsContext} from "../contexts/contexts.ts";

export const useInfiniteFeed = (
    fetchFn: (cursor?: Cursor) => {response: Promise<AxiosResponse<PostPage>>, abort: () => void},
    dependencies: unknown[] = []
) => {
    const {
        setPosts,
    } = useGetContext(LoadedPostsContext);
    const [cursor, setCursor] = useState<Cursor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadInitial = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setCursor(null);

        const { response, abort } = fetchFn();

        try {
            const { data: result } = await response;
            setPosts(result.posts);
            setCursor(result.cursor);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Request canceled:", error.message);
            } else {
                console.error("Failed to fetch posts:", error);
                setError("Failed to fetch posts")
            }
        } finally {
            setIsLoading(false);
        }

        return abort;
    }, dependencies);

    const loadMore = async () => {
        if (!cursor) return;
        try {
            const { response } = fetchFn(cursor);
            const { data: result } = await response;
            setPosts((prev) => [...prev, ...result.posts]);
            setCursor(result.cursor);
        } catch (error) {
            console.error("Failed to fetch more posts:", error);
            setError("Failed to fetch more posts");
        }
    };

    useEffect(() => {
        loadInitial();
    }, [loadInitial]);

    return { cursor, isLoading, error, loadMore };
};