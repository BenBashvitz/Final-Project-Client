import type {
  Cursor,
  Post,
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
  { description, img }: PostFormValuesSubmission,
  oldPost: Post,
): Promise<Post> => {
  const formData = {
    file: img,
    oldImgUrl: oldPost.imgUrl,
  };

  const { data: imgUrl } = await apiClient.put<UploadedPostResponse>(
    "/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  const { data } = await apiClient.put(`/post/${oldPost._id}`, {
    imgUrl,
    description,
  });

  return data;
};
