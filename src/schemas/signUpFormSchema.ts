import {z} from "zod";
import {SignInFormSchema} from "./signInFormSchema.ts";
import {EMAIL_INVALID, EMAIL_REQUIRED} from "../screens/login/consts.ts";

export const SignUpFormSchema = z.object({
    ...SignInFormSchema.shape,
    email: z.string().min(1, EMAIL_REQUIRED).email(EMAIL_INVALID),
})