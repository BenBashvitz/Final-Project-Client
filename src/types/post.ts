import type { PostUser } from "./user";

export type Post = {
  _id: string;
  imgUrl: string;
  description: string;
  user: PostUser;
  likeCount: number;
  commentCount: number;
  creationDate: string;
  isLikedByCurrentUser: boolean;
};

export type Cursor = {
  _id: Post["_id"];
  creationDate: Post["creationDate"];
};

export type PostPage = {
  posts: Post[];
  cursor: Cursor | null;
};

export type PostFormValues = {
  description: string;
  img: File | null;
};

export type PostFormValuesSubmission = Omit<PostFormValues, "img"> & {
  img: File;
};

export type UploadedPostResponse = {
  imgUrl: string;
};
