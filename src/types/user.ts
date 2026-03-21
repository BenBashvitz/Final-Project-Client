export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  imgUrl?: string;
};

export type UserSignInPayload = Omit<UserSignUpPayload, "email">;

export type UserSignUpPayload = {
  username: string;
  email: string;
  password: string;
};
