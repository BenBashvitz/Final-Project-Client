import type { AttachedUser } from "./user";

export type Comment = {
  _id: string;
  message: string;
  postId: string;
  user: AttachedUser;
  creationDate: string;
};

export type CommentInput = Pick<Comment, "message" | "postId" | "creationDate">;
