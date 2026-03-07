import type { Post } from "../types/post";
import { apiClient } from "./api-client";

export const getPosts = () => {
  const abortController = new AbortController();

  const response = apiClient.get<Post[]>("/posts", {
    signal: abortController.signal,
  });

  return { response, abort: () => abortController.abort() };
};
