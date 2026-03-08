import { useEffect, useState } from "react";
import { getPosts } from "../../services/posts-api";
import type { Post } from "../../types/post";
import NoPosts from "./noPosts/noPosts";
import { PostCard } from "./postCard/PostCard";

interface FeedScreenProps {
  currentUserId: number;
}

const FeedScreen = ({ currentUserId }: FeedScreenProps) => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { response, abort } = getPosts();
    response.then((res) => {
      setAllPosts(res.data);
      setIsLoading(false);
    });

    return () => abort();
  }, [currentUserId]);

  const handlePostCreation = () => {};

  return (
    <>
      {isLoading ? (
        <div>Loading feed page...</div>
      ) : allPosts.length === 0 ? (
        <NoPosts onCreatePost={handlePostCreation} />
      ) : (
        allPosts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </>
  );
};

export default FeedScreen;
