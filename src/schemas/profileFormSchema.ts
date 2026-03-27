import {z} from "zod";
import {IMAGE_ERROR_MESSAGE, USERNAME_REQUIRED} from "../consts.ts";

export const ProfileFormSchema = z.object({
    username: z.string().min(1, USERNAME_REQUIRED),
    img: z.union([z.file(IMAGE_ERROR_MESSAGE), z.url(IMAGE_ERROR_MESSAGE)]),
})