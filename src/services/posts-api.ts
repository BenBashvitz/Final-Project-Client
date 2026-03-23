import type {
  Cursor,
  Post,
  PostFormValues,
  PostFormValuesSubmission,
  PostPage,
  UploadedPostResponse,
} from "../types/post";
import { apiClient } from "./api-client";

export const getPosts = (cursor: Cursor | null) => {
  const abortController = new AbortController();

  const response = apiClient.get<PostPage>("/post", {
    signal: abortController.signal,
    params: cursor ? { cursor: JSON.stringify(cursor) } : undefined,
  });

  return { response, abort: () => abortController.abort() };
};

export const uploadPost = async ({
  img,
  description,
}: PostFormValuesSubmission): Promise<Post> => {
  const formData = new FormData();
  formData.append("file", img);

  const uploadPostImgResponse = await apiClient.post<UploadedPostResponse>(
    "/upload",
    formData,
  );

  const imgUrl = uploadPostImgResponse.data.imgUrl;

  const uploadPostResponse = await apiClient.post<Post>("/post", {
    description,
    imgUrl,
    creationDate: new Date(),
  });

  return uploadPostResponse.data;
};

export const editPost = async (
  { description, img }: PostFormValues,
  oldPost: Post,
): Promise<Post> => {
  let imgUrl = oldPost.imgUrl;

  if (img instanceof File) {
    const formData = new FormData();
    formData.append("file", img);
    formData.append("oldImgUrl", oldPost.imgUrl);

    const { data } = await apiClient.put<UploadedPostResponse>(
      "/upload",
      formData,
    );

    imgUrl = data.imgUrl;
  }

  const { data } = await apiClient.put(
    `/post/${encodeURIComponent(oldPost._id)}`,
    {
      imgUrl,
      description,
    },
  );

  return data;
};

export const deletePost = async (
  postId: string,
): Promise<Pick<Post, "_id">> => {
  const { data } = await apiClient.delete<Pick<Post, "_id">>(
    `/post/${encodeURIComponent(postId)}`,
  );

  return data;
};
