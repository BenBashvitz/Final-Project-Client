import type { Cursor } from "../types/cursor";
import type {
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

export const uploadPost = async ({ img, description }: PostFormValues) => {
  if (img) {
    const formData = new FormData(); // can be simple json as well, but still need to keep the "Content-Type": "multipart/form-data" because of the file upload
    formData.append("file", img);

    try {
      const uploadPostImgResponse = await apiClient.post<UploadedPostResponse>(
        "/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const imgUrl = uploadPostImgResponse.data.imgUrl;

      const uploadPostResponse = await apiClient.post("/post", {
        description,
        imgUrl,
        creationDate: new Date(),
      });

      return uploadPostResponse;
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  }
};
