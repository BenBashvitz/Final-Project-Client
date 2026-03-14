import type {
  Post,
  PostFormValues,
  PostPage,
  UploadedPostResponse,
  Cursor,
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
}: PostFormValues): Promise<Post> => {
  let imgUrl: string | null = null;

  if (img) {
    const formData = new FormData();
    formData.append("file", img);

    const uploadPostImgResponse = await apiClient.post<UploadedPostResponse>(
      "/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    imgUrl = uploadPostImgResponse.data.imgUrl;
  }

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
    const formData = {
      file: img,
      oldImgUrl: oldPost.imgUrl,
    };

    const { data } = await apiClient.put<UploadedPostResponse>(
      "/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    imgUrl = data.imgUrl;
  }

  const { data } = await apiClient.put(`/post/${oldPost._id}`, {
    imgUrl,
    description,
  });

  return data;
};
