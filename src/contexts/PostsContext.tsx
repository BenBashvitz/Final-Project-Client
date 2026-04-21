import { type PropsWithChildren } from "react";
import { LoadedPostsContext } from "./contexts";
import { usePostState } from "../utils/post.ts";

export const PostsProvider = ({ children }: PropsWithChildren) => {
    return (
        <LoadedPostsContext value={{ ...usePostState() }}>
            {children}
        </LoadedPostsContext>
    );
};
