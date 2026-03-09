import { useState, type ComponentProps, type PropsWithChildren } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

type InfiniteScrollWrapperProps = Omit<
  ComponentProps<typeof InfiniteScroll>,
  "next"
> & {
  fetchMore: (page: number) => void;
};

const InfiniteScrollWrapper = ({
  children,
  fetchMore,
  endMessage,
  loader,
  dataLength,
  hasMore,
}: PropsWithChildren<InfiniteScrollWrapperProps>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleFetchMore = () => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + 1;
      fetchMore(newPage);

      return newPage;
    });
  };

  return (
    <InfiniteScroll
      dataLength={dataLength}
      hasMore={hasMore}
      loader={loader}
      endMessage={endMessage}
      next={handleFetchMore}
    >
      {children}
    </InfiniteScroll>
  );
};

export default InfiniteScrollWrapper;
