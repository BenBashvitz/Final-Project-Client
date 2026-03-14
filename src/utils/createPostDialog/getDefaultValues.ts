import type { DefaultValues } from "react-hook-form";
import type { Post, PostFormValues } from "../../types/post";

export const getDefaultValues = (
  post?: Post,
): DefaultValues<PostFormValues> => ({
  description: post?.description ?? "",
  img: post?.imgUrl ?? "",
});
