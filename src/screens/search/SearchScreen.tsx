import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { PostCard } from "../../components/postCard/PostCard";
import { searchPosts } from "../../services/posts-api";
import styles from "./searchScreen.module.css";
import axios from "axios";
import { createPostState } from "../../utils/post";

const SearchScreen = () => {
    const [query, setQuery] = useState("");
    const {
        posts,
        setPosts,
        handleEditPost,
        handleDeletePost,
        handleLikePost
    } = createPostState();
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

    const getContent = () => {
        if (isLoading) {
            return <div className={styles.loading}>Searching posts...</div>
        } else if (error) {
            return <div className={styles.error}>{error}</div>
        } else if (posts.length === 0 && query) {
            return <div className={styles.noResults}>No posts found for "{query}"</div>
        } else {
            return posts.map((post) => (
                <PostCard
                    key={post._id}
                    post={post}
                    onEdit={handleEditPost}
                    onDelete={() => handleDeletePost(post._id)}
                    onLike={() => handleLikePost(post)}
                />
            ))
        }
    }

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
                        getContent()
                    }
                </div>
            </div>
        </div>
    );
};

export default SearchScreen;
