import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';

type ResponseType = typeof api.users.getUsersWithoutCurrentUser._returnType;

export const useGetUserWithoutCurrentUser = () => {
  const [data, setData] = useState<ResponseType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const result = useQuery(api.users.getUsersWithoutCurrentUser);

  useEffect(() => {
    if (result !== undefined) {
      setData(result);
      setIsLoading(false);
      setError(null);
    }
  }, [result]);

  return {
    data,
    isLoading,
    error,
  };
};
