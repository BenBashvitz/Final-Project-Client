import type { Cursor } from "../types/cursor";
import type { PostPage } from "../types/post";
import { apiClient } from "./api-client";

export const getPosts = (cursor: Cursor | null) => {
  const abortController = new AbortController();

  const response = apiClient.get<PostPage>(
    `/post?${cursor ? `cursor=${JSON.stringify(cursor)}` : ""}`,
    {
      signal: abortController.signal,
    },
  );

  return { response, abort: () => abortController.abort() };
};
