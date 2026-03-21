import type { Cursor } from "../types/post";
import type { PostPage } from "../types/post";
import { apiClient } from "./api-client";

export const getPosts = (cursor: Cursor | null) => {
  const abortController = new AbortController();

  const response = apiClient.get<PostPage>("/post", {
    signal: abortController.signal,
    params: cursor ? { cursor: JSON.stringify(cursor) } : undefined,
  });

  return { response, abort: () => abortController.abort() };
};
