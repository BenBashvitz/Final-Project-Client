import {z} from "zod";
import {PASSWORD_REQUIRED, USERNAME_REQUIRED} from "../consts/loginForms.ts";

export const SignInFormSchema = z.object({
    username: z.string().min(1, {message: USERNAME_REQUIRED}),
    password: z.string().min(1, {message: PASSWORD_REQUIRED}),
})