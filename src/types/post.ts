import { type Dispatch, type SetStateAction } from 'react';
import type z from "zod";
import type { PostFormSchema } from "../schemas/postFormSchema";
import type { AttachedUser } from "./user";

export type Post = {
  _id: string;
  imgUrl: string;
  description: string;
  user: AttachedUser;
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

export type PostFormValues = z.infer<typeof PostFormSchema>;

export type PostFormValuesSubmission = Omit<PostFormValues, "img"> & {
  img: File;
};

export type UploadedPostResponse = {
  imgUrl: string;
};

export type SetPostFn = Dispatch<SetStateAction<Post[]>>

export type PostFunctions = {
  handleEditPost: (editedPost: Post) => void
  handleDeletePost: (postId: string) => Promise<void>
  handleLikePost: (post: Post) => Promise<void>
}

export type PostsContext = {
  posts: Post[];
  setPosts: SetPostFn,
} & PostFunctions;

