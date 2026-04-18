import {useState} from "react";
import type {Post, PostFunctions, PostsContext, SetPostFn} from "../types/post";
import {mergeItems} from "./merge";
import {deletePost} from "../services/posts-api";
import {likePost, unlikePost} from "../services/likes-api";

export const usePostState = (): PostsContext => {
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

const createPostFunctions = (setFn: SetPostFn): PostFunctions => {
    return {
        handleEditPost: createEditPostFn(setFn),
        handleDeletePost: createDeletePostFn(setFn),
        handleLikePost: createLikePostFn(setFn)
    }
}

const createEditPostFn = (setFn: SetPostFn) => {
    return (editedPost: Post) => {
        setFn((prevPosts) => mergeItems(prevPosts, editedPost));
    }
};

const createDeletePostFn = (setFn: SetPostFn) => {
    return async (postId: Post["_id"]) => {
        try {
            const { _id } = await deletePost(postId);
            setFn((prevPosts) => prevPosts.filter((post) => post._id !== _id));
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    }
};

const createLikePostFn = (setFn: SetPostFn) => {
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