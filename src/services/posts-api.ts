import type { Post } from "../types/post";
import { apiClient } from "./api-client";

export const getPosts = (page: number) => {
  const abortController = new AbortController();

  const response = apiClient.get<Post[]>("/post?page=" + page, {
    signal: abortController.signal,
  });

  return { response, abort: () => abortController.abort() };
};
