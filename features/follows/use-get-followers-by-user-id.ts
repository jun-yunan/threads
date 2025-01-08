import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';

type ResponseType = (typeof api.follows.getFolloweesByUserId._returnType)[0];

export const useGetFollowersByUserId = () => {
  const [data, setData] = useState<ResponseType[] | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const result = useQuery(api.follows.getFolloweesByUserId);

  useEffect(() => {
    if (result !== undefined) {
      setData(result);
      setIsLoading(false);
      setError(null);
    }
  }, [result]);

  return {
    error,
    data,
    isLoading,
  };
};
