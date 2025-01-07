import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';

type ResponseType = typeof api.users.getCurrentUser._returnType;

export const useGetCurrentUser = () => {
  const [data, setData] = useState<ResponseType | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const result = useQuery(api.users.getCurrentUser);

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
