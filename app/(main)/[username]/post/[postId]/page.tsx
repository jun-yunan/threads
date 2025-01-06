'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { FunctionComponent, use, useMemo } from 'react';

type Params = Promise<{ username: string; postId: string }>;

interface PostDetailPageProps {
  params: Params;
}

const PostDetailPage: FunctionComponent<PostDetailPageProps> = (props) => {
  const params = use(props.params);
  const username = useMemo(() => decodeURIComponent(params.username), [params]);

  const postId = useMemo(
    () => decodeURIComponent(params.postId) as Id<'posts'>,
    [params],
  );

  const currentUser = useQuery(api.users.getCurrentUser);

  const userByUsername = useQuery(api.users.getUserByUsername, { username });

  const post = useQuery(api.posts.getById, { postId });

  const isCurrentUser = useMemo(
    () => currentUser?.username === userByUsername?.username,
    [currentUser, userByUsername],
  );

  const user = useMemo(
    () => (isCurrentUser ? currentUser : userByUsername),
    [currentUser, userByUsername, isCurrentUser],
  );
  return (
    <div className="w-full flex flex-col">
      <div>
        <Avatar>
          <AvatarImage />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </div>
      <p>{username}</p>
      <p>{postId}</p>
    </div>
  );
};

export default PostDetailPage;
