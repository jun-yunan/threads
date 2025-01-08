import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';

type ResponseType = typeof api.users.searchUsers._returnType;

export const useSearchUsers = (searchText: string) => {
  const [data, setData] = useState<ResponseType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const result = useQuery(
    api.users.searchUsers,
    searchText.trim() ? { searchText } : 'skip',
  );

  useEffect(() => {
    if (result !== undefined) {
      setData(result);
      setIsLoading(false);
    }
  }, [result]);

  return {
    data,
    isLoading: isLoading && searchText.trim() !== '',
  };
};
