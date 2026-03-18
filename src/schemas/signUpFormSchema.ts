import {z} from "zod";
import {SignInFormSchema} from "./signInFormSchema.ts";
import {EMAIL_INVALID, EMAIL_REQUIRED} from "../consts/loginForms.ts";

export const SignUpFormSchema = z.object({
    ...SignInFormSchema.shape,
    email: z.email(EMAIL_INVALID).min(1, EMAIL_REQUIRED),
})