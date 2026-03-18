import {apiClient} from "./api-client";
import type {UserSignInPayload, UserSignUpPayload} from "../types";
import type {AxiosError} from "axios";

export const signIn = (payload: UserSignInPayload) => apiClient.post("/auth/login", payload, {
    withCredentials: true
});

export const signUp = (payload: UserSignUpPayload) => apiClient.post("/auth/register", payload, {
    withCredentials: true
});

const refreshTokenUrl = '/auth/refresh-token'

export const refreshToken = () => apiClient.post(refreshTokenUrl, {}, {
    withCredentials: true,
});

export const logout = () => apiClient.post(`/auth/logout`, {}, {
    withCredentials: true
});

export const refreshTokenOnUnauthorized = (onRefreshError: () => void) => {
    apiClient.interceptors.response.use(
        (response) => response,
        async (error: AxiosError<unknown, {_retry: boolean}>) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !!originalRequest && originalRequest.url !== refreshTokenUrl && !originalRequest.data?._retry) {
                originalRequest.data = {
                    _retry: true,
                };

                try {
                    await refreshToken();

                    return apiClient(originalRequest);
                } catch (refreshError) {
                    onRefreshError();
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );
}
