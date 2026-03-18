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
    return apiClient.post(`/auth/refresh-token`, {}, {
        withCredentials: true
    });
}

export const logout = () => {
    return apiClient.post(`/auth/logout`, {}, {
        withCredentials: true
    });
}

export const refreshTokenOnUnauthorized = (onRefreshError: () => void) => {
    apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // Mark as retried to prevent infinite loops

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
