import {apiClient} from "./api-client";
import type {UserSignInPayload, UserSignUpPayload} from "../types";

export const signIn = (payload: UserSignInPayload) => {
    return apiClient.post("/auth/login", payload, {
        withCredentials: true
    });
};

export const signUp = (payload: UserSignUpPayload) => {
    return apiClient.post("/auth/register", payload, {
        withCredentials: true
    });
};

export const refreshToken = () => {
    const abortController = new AbortController();

    const response = apiClient.post(`/auth/refresh-token`, {}, {
        signal: abortController.signal,
        withCredentials: true
    });

    return {response, abort: () => abortController.abort()};
}