// import { api } from '@/convex/_generated/api';
// import { useQuery } from 'convex/react';
// import { useEffect, useState } from 'react';

// type ResponseType = boolean | undefined;

// export const useIsFollowing = () => {
//   const [data, setData] = useState<ResponseType | undefined>(false);
//   const [error, setError] = useState<Error | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const result = useQuery(api.users.getCurrentUser);

//   useEffect(() => {
//     if (result !== undefined) {
//       setData(result);
//       setIsLoading(false);
//       setError(null);
//     }
//   }, [result]);

//   return {
//     error,
//     data,
//     isLoading,
//   };
// };
