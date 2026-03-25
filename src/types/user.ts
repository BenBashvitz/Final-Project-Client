import type {ProfileFormSchema} from "../schemas/profileFormSchema.ts";
import {z} from "zod";

export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  imgUrl?: string;
};

export type AttachedUser = Omit<User, "email" | "password">;

export type UserSignInPayload = Omit<UserSignUpPayload, "email">;

export type UserSignUpPayload = {
  username: string;
  email: string;
  password: string;
};

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

export type UserContext = {
  currentUser: Omit<User, "password"> | null;
  setCurrentUser: (user: Omit<User, "password">) => void;
};
