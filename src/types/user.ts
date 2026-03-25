import type {Dispatch, SetStateAction} from "react";

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

export type UserContext = {
  currentUser: Omit<User, "password"> | null;
  setCurrentUser: Dispatch<SetStateAction<Omit<User, "password"> | null>>
};
