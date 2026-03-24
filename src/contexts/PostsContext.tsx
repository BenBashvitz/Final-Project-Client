import {type PropsWithChildren, useState} from "react";
import {LoadedPostsContext} from "./contexts";
import type {Post} from "../types/post.ts";

export const PostsProvider = ({ children }: PropsWithChildren) => {
    const [posts, setPosts] = useState<Post[]>([]);

    return (
        <LoadedPostsContext value={{ posts, setPosts }}>
            {children}
        </LoadedPostsContext>
    );
};
