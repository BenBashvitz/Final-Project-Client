import { createContext } from "react";
import type { UserContext } from "../types";

export const CurrentUserContext = createContext<UserContext | null>(null);
