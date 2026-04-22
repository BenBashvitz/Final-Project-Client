import {useState} from "react";
import type {Post, PostFunctions, PostsContext, SetCurrentUserPostCountFn, SetPostFn} from "../types/post";
import {mergeItems} from "./merge";
import {deletePost} from "../services/posts-api";
import {likePost, unlikePost} from "../services/likes-api";

export const usePostState = (): PostsContext => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentUserPostsCount, setCurrentUserPostsCount] = useState(0);

    const {
        handleAddPost,
        handleEditPost,
        handleDeletePost,
        handleLikePost
    } = createPostFunctions(setPosts, setCurrentUserPostsCount)

    return {
        posts,
        setPosts,
        currentUserPostsCount,
        setCurrentUserPostsCount,
        handleAddPost,
        handleEditPost,
        handleDeletePost,
        handleLikePost,
    }

}

const createPostFunctions = (setFn: SetPostFn, setCurrentUserPostCountFn: SetCurrentUserPostCountFn): PostFunctions => {
    return {
        handleAddPost: createAddPostFn(setFn, setCurrentUserPostCountFn),
        handleEditPost: createEditPostFn(setFn),
        handleDeletePost: createDeletePostFn(setFn, setCurrentUserPostCountFn),
        handleLikePost: createLikePostFn(setFn)
    }
}

const createAddPostFn = (setFn: SetPostFn, setCurrentUserPostCountFn: SetCurrentUserPostCountFn) => {

    return (createdPost: Post) => {
        setCurrentUserPostCountFn(prevCount => prevCount + 1)
        setFn((prevPosts) => prevPosts.concat(createdPost));
    }
};

const createEditPostFn = (setFn: SetPostFn) => {
    return (editedPost: Post) => {
        setFn((prevPosts) => mergeItems(prevPosts, editedPost));
    }
};

const createDeletePostFn = (setFn: SetPostFn, setCurrentUserPostCountFn: SetCurrentUserPostCountFn) => {

    return async (postId: Post["_id"]) => {
        try {
            const {_id} = await deletePost(postId);
            setCurrentUserPostCountFn(prevCount => prevCount - 1)
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