export type User = {
    id: string;
    username: string;
    email: string;
    password: string;
}

export type UserSignInPayload = Omit<UserSignUpPayload, 'email'>

export type UserSignUpPayload = {
    username: string;
    email: string;
    password: string;
}

