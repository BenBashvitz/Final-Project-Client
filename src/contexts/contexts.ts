import { createContext } from "react";
import type { UserContext } from "../types";
import type {PostsContext} from "../types/post.ts";

export const CurrentUserContext = createContext<UserContext | null>(null);

export const LoadedPostsContext = createContext<PostsContext | null>(null)