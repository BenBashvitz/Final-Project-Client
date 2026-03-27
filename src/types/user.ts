import type {Dispatch, SetStateAction} from "react";
import type {ProfileFormSchema} from "../schemas/profileFormSchema.ts";
import {z} from "zod";


export type User = {
    _id: string;
    username: string;
    email: string;
    password: string;
    imgUrl?: string;
};

export type LoggedInUser = Omit<User, "password">;

export type AttachedUser = Omit<User, "email" | "password">;

export type UserSignUpPayload = Pick<User, 'username' | 'password' | 'email'>;

export type UserSignInPayload = Omit<UserSignUpPayload, "email">;

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

export type UserContext = {
    currentUser: LoggedInUser | null;
    setCurrentUser: Dispatch<SetStateAction<LoggedInUser | null>>
};

export type ProfileUpdate = Pick<User, 'imgUrl' | 'username'>