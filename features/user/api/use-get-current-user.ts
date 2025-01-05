import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';

export type GetUserReturnType = typeof api.users.getCurrentUser._returnType;

export const useGetCurrentUser = ({}: {}) => {
  return useQuery(api.users.getCurrentUser);
};
