import { api } from '@/convex/_generated/api';
import { usePaginatedQuery } from 'convex/react';

export type GetPostsReturnType = (typeof api.posts.get._returnType)['page'];

const BATCH_SIZE = 20;

interface UseGetPostsProps {}

export const useGetPosts = ({}: UseGetPostsProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.posts.get,
    {},
    { initialNumItems: BATCH_SIZE },
  );

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
