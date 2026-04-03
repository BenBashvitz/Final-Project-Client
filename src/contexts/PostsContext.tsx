import { type PropsWithChildren } from "react";
import { LoadedPostsContext } from "./contexts";
import { createPostState } from "../utils/post.ts";

export const PostsProvider = ({ children }: PropsWithChildren) => {
    return (
        <LoadedPostsContext value={{ ...createPostState() }}>
            {children}
        </LoadedPostsContext>
    );
};
