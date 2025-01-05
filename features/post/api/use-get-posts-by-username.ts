import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { usePaginatedQuery } from 'convex/react';

export type GetPostsReturnType = (typeof api.posts.get._returnType)['page'];

const BATCH_SIZE = 20;

interface UseGetPostsByUsername {
  username: string;
}

export const useGetPostsByUsername = ({ username }: UseGetPostsByUsername) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.posts.getByUsername,
    { username },
    { initialNumItems: BATCH_SIZE },
  );

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
