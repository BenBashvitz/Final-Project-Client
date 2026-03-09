import type { Cursor } from "./cursor";

export type Post = {
  _id: string;
  imgUrl: string;
  description: string;
  sender: string;
  likeCount: number;
  commentCount: number;
  creationDate: string;
};

export type PostPage = {
  posts: Post[];
  nextCursor: Cursor;
};
