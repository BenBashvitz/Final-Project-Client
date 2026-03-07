import { useEffect, useState } from "react";
import { getPosts } from "../../services/posts-api";
import type { Post } from "../../types/post";
import NoPosts from "./noPosts/noPosts";

interface FeedScreenProps {
  currentUserId: number;
}

const FeedScreen = ({ currentUserId }: FeedScreenProps) => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    const { response, abort } = getPosts();
    response.then((res) => setAllPosts(res.data));

    return () => abort();
  }, [currentUserId]);

  const handlePostCreation = () => {};

  return (
    <>
      {allPosts.length === 0 ? (
        <NoPosts onCreatePost={handlePostCreation} />
      ) : (
        allPosts.map((post) => (
          <div key={post._id}></div>
          //   <PostCard
          //     key={post.id}
          //     post={post}
          //     currentUser={currentUser}
          //     onEdit={onEditPost}
          //     onComments={onComments}
          //     onUpdate={loadPosts}
          //   />
        ))
      )}
    </>
  );
};

export default FeedScreen;
