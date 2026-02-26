export type User = {
    id: string;
    username: string;
    email: string;
    password: string;
}

export type UserSignInPayload = {
    email: string;
    password: string;
}

export type UserSignUpPayload = {
    username: string;
    email: string;
    password: string;
}

