import type { Post, PostFormValues } from "../../types/post";

export const getDefaultValues = (post?: Post): PostFormValues => ({
  description: post?.description ?? "",
  img: null,
});
