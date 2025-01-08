'use client';

import { FunctionComponent, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  BellOff,
  Bookmark,
  EyeOff,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat,
  Send,
  Link2,
  Pin,
  ChevronRight,
  Trash,
  Ban,
  Loader2,
  UserX,
} from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Doc } from '@/convex/_generated/dataModel';
import { useIsMobile } from '@/hooks/use-mobile';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/hooks/use-modal-store';
import { DialogCardProfile } from './dialogs/dialog-card-profile';
import { HoverCardProfile } from './hover-card-profile';
import { DialogReviewImage } from './dialogs/dialog-review-image';
import { api } from '@/convex/_generated/api';
import ToggleLikePost from './toggle-like-post';
import RepliesPost from './replies-post';
import { useUnFollow } from '@/features/follows/use-un-follow';
import { toast } from 'sonner';

type Post = (typeof api.follows.getFolloweesByUserId._returnType)[0];

interface RendererPostFolloweeProps {
  currentUser: Doc<'users'> | undefined;
  post: Post;
}

const RendererPostFollowee: FunctionComponent<RendererPostFolloweeProps> = ({
  post,
  currentUser,
}) => {
  const isMobile = useIsMobile();

  const router = useRouter();

  const { onOpen } = useModalStore();

  const { mutate: mutationUnFollow, isPending } = useUnFollow();

  const handleUnFollow = async () => {
    if (currentUser && post) {
      mutationUnFollow({
        followeeId: post?.author._id,
        followerId: currentUser._id,
      })
        .then((data) => toast.success('Bỏ theo dõi thành công'))
        .catch((error) => toast.error('Bỏ theo dõi thất bại'));
    }
  };

  return (
    <div key={post?._id} className="w-full flex flex-col gap-y-2">
      <div className="w-full flex justify-between">
        <div className="flex items-center gap-x-2">
          {post && !isMobile && (
            <HoverCardProfile information={post.author}>
              <Avatar className="cursor-pointer hover:opacity-70 duration-300 transition-all">
                <AvatarImage
                  className="object-cover"
                  src={post.author.imageUrl}
                  alt={post.author.username}
                />
                <AvatarFallback>
                  <Loader2 className="animate-spin" />
                </AvatarFallback>
              </Avatar>
            </HoverCardProfile>
          )}
          {post && isMobile && (
            <DialogCardProfile information={post.author}>
              <Avatar className="cursor-pointer hover:opacity-70 duration-300 transition-all">
                <AvatarImage
                  src={post.author.imageUrl}
                  alt={post.author.username}
                />
                <AvatarFallback>
                  <Loader2 className="animate-spin" />
                </AvatarFallback>
              </Avatar>
            </DialogCardProfile>
          )}
          <div className="flex flex-col justify-between items-start">
            <Link
              href={`/${post?.author.username}`}
              className="text-sm font-semibold hover:underline"
            >
              {post?.author.username}
            </Link>
            <p className="text-muted-foreground text-sm">
              {post?._creationTime &&
                format(new Date(post._creationTime), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="self-start rounded-full"
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-52 p-3">
            <DropdownMenuItem className="py-2 cursor-pointer lg:text-base text-sm font-medium">
              <Bookmark />
              <p>Lưu</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2 cursor-pointer lg:text-base text-sm font-medium">
              <EyeOff />
              <p>Không quan tâm</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="py-2 cursor-pointer lg:text-base text-sm font-medium">
              <BellOff />
              <p>Tắt thông báo</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-2 cursor-pointer lg:text-base text-sm font-medium"
              onClick={handleUnFollow}
            >
              <UserX />
              <p>Bỏ theo dõi</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2 cursor-pointer lg:text-base text-sm font-medium">
              <Flag />
              <p>Báo cáo</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="py-2 cursor-pointer lg:text-base text-sm font-medium">
              <Link2 />
              <p>Sao chép liên kết</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full flex flex-col items-start gap-y-2">
        <Link
          href={`/${post?.author.username}/post/${post?._id}`}
          className="pl-12 text-base text-wrap break-words whitespace-pre-wrap break-all"
        >
          {post?.content}
        </Link>
        {post?.image && (
          <DialogReviewImage imageUrl={post.image}>
            <div className="pl-12 w-full max-h-[500px] relative overflow-hidden cursor-pointer hover:opacity-75 duration-500 ease-in-out transition-all">
              <Image
                src={post?.image}
                alt=""
                width={500}
                height={500}
                className="w-full object-cover rounded-lg"
              />
            </div>
          </DialogReviewImage>
        )}
        <div className="ml-8 flex items-center gap-x-4">
          {post && currentUser && (
            <ToggleLikePost postId={post?._id} userId={currentUser?._id} />
          )}
          {post && currentUser && (
            <RepliesPost post={post} currentUser={currentUser} />
          )}
          <Button className="rounded-full" variant="ghost">
            <Repeat />
            <p>0</p>
          </Button>
          <Button className="rounded-full" variant="ghost">
            <Send />
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default RendererPostFollowee;
