import type { Cursor } from "./cursor";
import type { PostUser } from "./user";

export type Post = {
  _id: string;
  imgUrl?: string;
  description: string;
  user: PostUser;
  likeCount: number;
  commentCount: number;
  creationDate: string;
  isLikedByCurrentUser: boolean;
};

export type PostInput = Pick<Post, "description" | "imgUrl"> & {
  creationDate: string;
  userId: string;
};

export type PostPage = {
  posts: Post[];
  nextCursor: Cursor;
};

export type PostFormValues = {
  description: string;
  img: File | null;
};

export type UploadedPostResponse = {
  imgUrl: string;
};
