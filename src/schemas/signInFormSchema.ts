import {z} from "zod";
import {PASSWORD_REQUIRED} from "../consts/loginForms.ts";
import {USERNAME_REQUIRED} from "../consts.ts";

export const SignInFormSchema = z.object({
    username: z.string().min(1, {message: USERNAME_REQUIRED}),
    password: z.string().min(1, {message: PASSWORD_REQUIRED}),
})