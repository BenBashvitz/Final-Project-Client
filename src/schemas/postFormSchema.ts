import z from "zod";
import {DESCRIPTION_ERROR_MESSAGE,} from "../consts/postForm";
import {IMAGE_ERROR_MESSAGE} from "../consts.ts";

export const PostFormSchema = z.object({
    description: z.string().min(1, DESCRIPTION_ERROR_MESSAGE),
    img: z.union([z.file(IMAGE_ERROR_MESSAGE), z.url(IMAGE_ERROR_MESSAGE)]),
});
