'use client';

import RendererPost from '@/app/(main)/_components/renderer-post';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { format } from 'date-fns';
import { ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
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

  const post = useQuery(api.posts.getById, { postId, username });

  const isCurrentUser = useMemo(
    () =>
      currentUser && userByUsername && currentUser._id === userByUsername._id,
    [currentUser, userByUsername],
  );

  const user = useMemo(
    () => (isCurrentUser ? currentUser : userByUsername),
    [currentUser, userByUsername, isCurrentUser],
  );

  const replies = useQuery(api.replies.getReplyByPostId, { postId });
  return (
    <div className="flex w-full flex-col gap-y-4 p-4">
      {post && <RendererPost currentUser={currentUser} post={post} />}
      <div className="w-full flex items-center justify-between">
        <p className="text-sm lg:text-base font-semibold">Trả lời bài đăng</p>
        <Button className="" variant={'outline'}>
          Xem hoạt động <ChevronRight />
        </Button>
      </div>
      <Separator />
      <div className="w-full h-full p-4">
        {replies && replies.map((reply) => <div key={reply._id}></div>)}
      </div>
    </div>
  );
};

export default PostDetailPage;
