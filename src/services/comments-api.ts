import type { Comment, CommentInput } from "../types/comment";
import { apiClient } from "./api-client";

export const createComment = async (
  comment: CommentInput,
): Promise<Comment> => {
  const { data } = await apiClient.post<Comment>(
    `/post/${comment.postId}/comment`,
    comment,
  );

  return data;
};
