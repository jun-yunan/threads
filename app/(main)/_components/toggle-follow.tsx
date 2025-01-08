'use client';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useToggleFollow } from '@/features/follows/use-toggle-follow';
import { error } from 'console';
import { useQuery } from 'convex/react';
import { UserCheck, UserPlus } from 'lucide-react';
import { FunctionComponent } from 'react';
import { toast } from 'sonner';

interface ToggleFollowProps {
  followerId: Id<'users'>;
  followeeId: Id<'users'>;
}

const ToggleFollow: FunctionComponent<ToggleFollowProps> = ({
  followeeId,
  followerId,
}) => {
  const { mutate: mutationToggleFollow } = useToggleFollow();

  const isFollowing = useQuery(api.follows.isFollowing, {
    followeeId,
    followerId,
  });

  const handleFollow = async () => {
    mutationToggleFollow({ followeeId, followerId })
      .then((data) =>
        toast.success(
          !isFollowing ? 'Theo dõi thành công' : 'Bỏ theo dõi thành công',
        ),
      )
      .catch((error) => toast.error('Theo dõi thất bại'));
  };

  return (
    <>
      {isFollowing ? (
        <Button className="text-sm font-semibold" onClick={handleFollow}>
          <UserCheck /> Đang theo dõi
        </Button>
      ) : (
        <Button
          className="text-sm font-semibold"
          variant="outline"
          onClick={handleFollow}
        >
          <UserPlus /> Theo dõi
        </Button>
      )}
    </>
  );
};

export default ToggleFollow;
