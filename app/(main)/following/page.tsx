'use client';

import { useGetFollowersByUserId } from '@/features/follows/use-get-followers-by-user-id';
import { useGetCurrentUser } from '@/features/users/api/use-get-current-user';
import { Loader2 } from 'lucide-react';
import { FunctionComponent } from 'react';
import RendererPostFollowee from '../_components/renderer-post-followee';

interface FollowingPageProps {}

const FollowingPage: FunctionComponent<FollowingPageProps> = () => {
  const { data: followers, isLoading } = useGetFollowersByUserId();
  const { data: currentUser } = useGetCurrentUser();
  return (
    <div>
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        followers &&
        followers.map((followee) => (
          <div key={followee?._id} className="flex w-full flex-col gap-y-4 p-4">
            <RendererPostFollowee currentUser={currentUser} post={followee} />
          </div>
        ))
      )}
    </div>
  );
};

export default FollowingPage;
