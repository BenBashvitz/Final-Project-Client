import type { Cursor } from "../types/cursor";
import type {
  Post,
  PostFormValues,
  PostPage,
  UploadedPostResponse,
} from "../types/post";
import { apiClient } from "./api-client";

export const getPosts = (cursor: Cursor | null) => {
  const abortController = new AbortController();

  const response = apiClient.get<PostPage>(
    `/post?${cursor ? `cursor=${JSON.stringify(cursor)}` : ""}`,
    {
      signal: abortController.signal,
    },
  );

  return { response, abort: () => abortController.abort() };
};

export const uploadPost = async ({
  img,
  description,
}: PostFormValues): Promise<Post> => {
  let imgUrl: string | null = null;

  if (img) {
    const formData = new FormData(); // can be simple json as well, but still need to keep the "Content-Type": "multipart/form-data" because of the file upload
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
