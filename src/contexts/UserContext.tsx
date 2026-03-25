import {type PropsWithChildren, useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {refreshToken, refreshTokenOnUnauthorized} from "../services/auth-api";
import type {User} from "../types";
import {CurrentUserContext} from "./contexts";

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<Omit<User, "password"> | null>(
    null,
  );

  const location = useLocation();
  const navigate = useNavigate();
  const isRefreshing = useRef(false);

  useEffect(() => {
    refreshTokenOnUnauthorized(() => navigate("/sign-in"));

    if (!isRefreshing.current) {
      isRefreshing.current = true;

      refreshToken()
        .then((user) => {
          setCurrentUser(user);
          if (
            location.pathname === "/sign-in" ||
            location.pathname === "/sign-up"
          ) {
            navigate("/");
          }
        })
        .catch(() => {
          navigate("/sign-in");
        })
        .finally(() => {
          isRefreshing.current = false;
        });
    }
  }, []);

  return (
    <CurrentUserContext value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext>
  );
};
