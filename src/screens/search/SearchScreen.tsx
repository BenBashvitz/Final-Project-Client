import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { PostCard } from "../../components/postCard/PostCard";
import { searchPosts } from "../../services/posts-api";
import { mergeItems } from "../../utils/merge";
import type { Post } from "../../types/post";
import styles from "./searchScreen.module.css";
import axios from "axios";
import { likePost, unlikePost } from "../../services/likes-api";
import { deletePost } from "../../services/posts-api";

const SearchScreen = () => {
    const [query, setQuery] = useState("");
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (query.trim()) {
            setIsLoading(true);
            setError(null);

            try {
                const { response } = searchPosts(query);
                const { data } = await response;
                setPosts(data);
            } catch (err) {
                if (!axios.isCancel(err)) {
                    console.error("Failed to search posts:", err);
                    setError("Failed to fetch posts. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleEditPost = (editedPost: Post) => {
        setPosts((prevPosts) => mergeItems(prevPosts, editedPost));
    };

    const handleDeletePost = async (postId: Post["_id"]) => {
        try {
            const { _id } = await deletePost(postId);
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== _id));
        } catch (err) {
            console.error("Failed to delete post:", err);
        }
    };

    const handleLikePost = async (post: Post) => {
        try {
            const updatedPost = post.isLikedByCurrentUser
                ? await unlikePost(post._id)
                : await likePost(post._id);

            setPosts((prevPosts) => mergeItems(prevPosts, updatedPost));
        } catch (err) {
            console.error("Failed to like post:", err);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.searchContainer}>
                <Input
                    placeholder="Search for posts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.searchInput}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                    <Search size={18} />
                    <span>Search</span>
                </Button>
            </div>

            <div className={styles.scrollContainer}>
                <div className={styles.resultsContainer}>
                    {

                        isLoading
                            ? <div className={styles.loading}>Searching posts...</div>
                            : error
                                ? <div className={styles.error}>{error}</div>
                                : (!error && posts.length === 0 && query)
                                    ? <div className={styles.noResults}>No posts found for "{query}"</div>
                                    : <>
                                        {posts.map((post) => (
                                            <PostCard
                                                key={post._id}
                                                post={post}
                                                onEdit={handleEditPost}
                                                onDelete={() => handleDeletePost(post._id)}
                                                onLike={() => handleLikePost(post)}
                                            />
                                        ))}
                                    </>

                    }
                </div>
            </div>
        </div>
    );
};

export default SearchScreen;
