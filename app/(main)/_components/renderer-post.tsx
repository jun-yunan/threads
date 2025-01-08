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
type Post = (typeof api.posts.getByUsername._returnType)['page'][0];

interface RendererPostProps {
  currentUser: Doc<'users'> | undefined;
  post: Post;
}

const RendererPost: FunctionComponent<RendererPostProps> = ({
  post,
  currentUser,
}) => {
  const isMobile = useIsMobile();

  const router = useRouter();

  const { onOpen } = useModalStore();

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
          {currentUser?._id === post?.author._id ? (
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Bookmark />
                <p>Lưu</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Pin />
                <p>Ghim lên trang cá nhân</p>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <p>Ai có thể trả lời trích dẫn</p>
                <ChevronRight />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {post && (
                <DropdownMenuItem
                  onClick={() => onOpen('deletePost', { postId: post._id })}
                >
                  <Trash />
                  <p>Xóa</p>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link2 />
                <p>Sao chép liên kết</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          ) : (
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Bookmark />
                <p>Lưu</p>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <EyeOff />
                <p>Không quan tâm</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <BellOff />
                <p>Tắt thông báo</p>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Ban />
                <p>Chặn</p>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Flag />
                <p>Báo cáo</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link2 />
                <p>Sao chép liên kết</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
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

export default RendererPost;
