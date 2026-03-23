import type { LikeResponse } from "../types/like";
import { apiClient } from "./api-client";

export const likePost = async (postId: string): Promise<LikeResponse> => {
  const { data } = await apiClient.post<LikeResponse>(`/post/${postId}/like`);

  return data;
};

export const unlikePost = async (postId: string): Promise<LikeResponse> => {
  const { data } = await apiClient.delete<LikeResponse>(`/post/${postId}/like`);

  return data;
};
