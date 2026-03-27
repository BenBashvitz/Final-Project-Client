import { apiClient } from "./api-client";
import type { LoggedInUser, UserSignInPayload, UserSignUpPayload } from "../types";
import type { AxiosError } from "axios";
import type {CredentialResponse} from "@react-oauth/google";

export const signIn = async (
  payload: UserSignInPayload,
): Promise<LoggedInUser> => {
  const { data } = await apiClient.post<LoggedInUser>(
    "/auth/login",
    payload,
    {
      withCredentials: true,
    },
  );

  return data;
};

export const signUp = async (
  payload: UserSignUpPayload,
): Promise<LoggedInUser> => {
  const { data } = await apiClient.post<LoggedInUser>(
    "/auth/register",
    payload,
    {
      withCredentials: true,
    },
  );

  return data;
};

const refreshTokenUrl = "/auth/refresh-token";

export const refreshToken = async (): Promise<LoggedInUser> => {
  const { data } = await apiClient.post<LoggedInUser>(
    refreshTokenUrl,
    {},
    {
      withCredentials: true,
    },
  );

  return data;
};

export const logout = () =>
  apiClient.post(
    `/auth/logout`,
    {},
    {
      withCredentials: true,
    },
  );

export const refreshTokenOnUnauthorized = (onRefreshError: () => void) => {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<unknown, { _retry: boolean }>) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !!originalRequest &&
        originalRequest.url !== refreshTokenUrl
      ) {
        try {
          await refreshToken();

          return apiClient(originalRequest);
        } catch (refreshError) {
          onRefreshError();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
};

export const googleSignIn = async (credentialResponse: CredentialResponse) => {
    const {data} = await apiClient.post<Omit<User, "password">>(
        "/auth/google",
        credentialResponse,
    );

    return data;
};