import { useState, type Dispatch, type SetStateAction } from "react";
import type { Post, PostsContext } from "../types/post";
import { mergeItems } from "./merge";
import { deletePost } from "../services/posts-api";
import { likePost, unlikePost } from "../services/likes-api";

export const createPostState = (): PostsContext => {
    const [posts, setPosts] = useState<Post[]>([]);

    const {
        handleEditPost,
        handleDeletePost,
        handleLikePost
    } = createPostFunctions(setPosts)

    return {
        posts,
        setPosts,
        handleEditPost,
        handleDeletePost,
        handleLikePost
    }

}

const createPostFunctions = (setFn: Dispatch<SetStateAction<Post[]>>): {
    handleEditPost: (editedPost: Post) => void
    handleDeletePost: (postId: string) => Promise<void>
    handleLikePost: (post: Post) => Promise<void>
} => {
    return {
        handleEditPost: createEditPostFn(setFn),
        handleDeletePost: createDeletePostFn(setFn),
        handleLikePost: createLikePostFn(setFn)
    }
}

const createEditPostFn = (setFn: Dispatch<SetStateAction<Post[]>>) => {
    return (editedPost: Post) => {
        setFn((prevPosts) => mergeItems(prevPosts, editedPost));
    }
};

const createDeletePostFn = (setFn: Dispatch<SetStateAction<Post[]>>) => {
    return async (postId: Post["_id"]) => {
        try {
            const { _id } = await deletePost(postId);
            setFn((prevPosts) => prevPosts.filter((post) => post._id !== _id));
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    }
};

const createLikePostFn = (setFn: Dispatch<SetStateAction<Post[]>>) => {
    return async (post: Post) => {
        try {
            const updatedPost = post.isLikedByCurrentUser
                ? await unlikePost(post._id)
                : await likePost(post._id);

            setFn((prevPosts) => mergeItems(prevPosts, updatedPost));
        } catch (error) {
            console.error("Failed to like post:", error);
        }
    }
};