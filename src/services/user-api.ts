import type {UploadedPostResponse,} from "../types/post";
import {apiClient} from "./api-client";
import type {ProfileFormValues, User} from "../types";

export const editProfile = async (
    { username, img }: ProfileFormValues,
    user: User,
): Promise<User> => {
    let imgUrl = user.imgUrl;

    if (img instanceof File) {
        const formData = new FormData();
        formData.append("file", img);
        formData.append("oldImgUrl", user.imgUrl ?? '');

        const { data } = await apiClient.put<UploadedPostResponse>(
            "/upload",
            formData,
        );

        imgUrl = data.imgUrl;
    }

    const { data } = await apiClient.put(
        `/user/${encodeURIComponent(user._id)}`,
        {
            imgUrl,
            username,
        },
    );

    return data;
};
