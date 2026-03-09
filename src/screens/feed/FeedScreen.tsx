import { useEffect, useState, type ComponentProps } from "react";
import { getPosts } from "../../services/posts-api";
import type { Post } from "../../types/post";
import NoPosts from "./noPosts/noPosts";
import { PostCard } from "./postCard/PostCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { InitialPostPage } from "../../consts";

interface FeedScreenProps {
  currentUserId: number;
}

const FeedScreen = ({ currentUserId }: FeedScreenProps) => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(InitialPostPage);

  useEffect(() => {
    const { response, abort } = getPosts(InitialPostPage);
    response.then((res) => {
      setAllPosts(res.data);
      setIsLoading(false);
    });

    return () => abort();
  }, [currentUserId]);

  const handlePostCreation = () => {};

  const fetchMorePosts = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      const { response } = getPosts(nextPage);
      response.then((res) => {
        setAllPosts((prevPosts) => [...prevPosts, ...res.data]);
      });
      return nextPage;
    });
  };

  return (
    <>
      {isLoading ? (
        <div>Loading feed page...</div>
      ) : allPosts.length === 0 ? (
        <NoPosts onCreatePost={handlePostCreation} />
      ) : (
        <InfiniteScroll
          hasMore={false}
          loader={<div>loading...</div>}
          endMessage="You have reached the end of the feed"
          dataLength={allPosts.length}
          next={fetchMorePosts}
        >
          {allPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </InfiniteScroll>
      )}
    </>
  );
};

export default FeedScreen;
