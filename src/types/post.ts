import type { Cursor } from "./cursor";
import type { PostUser } from "./user";

export type Post = {
  _id: string;
  imgUrl?: string;
  description: string;
  sender: PostUser;
  likeCount: number;
  commentCount: number;
  creationDate: string;
  isLikedByCurrentUser: boolean;
};

export type PostPage = {
  posts: Post[];
  nextCursor: Cursor;
};
