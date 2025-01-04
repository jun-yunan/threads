'use client';

import { FunctionComponent, useMemo } from 'react';
import { useGetPosts } from '@/features/post/api/use-get-posts';
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
  UserRoundX,
  Link2,
  Pin,
  ChevronRight,
  Trash,
  Ban,
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
import { HoverCardProfile } from '../../_components/hover-card-profile';
import { useIsMobile } from '@/hooks/use-mobile';
import { DialogCardProfile } from '../../_components/dialogs/dialog-card-profile';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DialogReviewImage } from '../../_components/dialogs/dialog-review-image';

interface PostsProps {
  currentUser: Doc<'users'> | undefined;
}

const Posts: FunctionComponent<PostsProps> = ({ currentUser }) => {
  const { results, loadMore, status } = useGetPosts({});
  const isMobile = useIsMobile();

  const router = useRouter();

  return (
    <div className="flex w-full flex-col gap-y-4 p-4">
      {results &&
        results.map((post) => (
          <div key={post?._id} className="w-full flex flex-col gap-y-2">
            <div className="w-full flex justify-between">
              <div className="flex items-center gap-x-2">
                {post && !isMobile && (
                  <HoverCardProfile information={post.author}>
                    <Avatar className="cursor-pointer hover:opacity-70 duration-300 transition-all">
                      <AvatarImage
                        src={post.author.imageUrl}
                        alt={post.author.username}
                      />
                      <AvatarFallback>{post.author.username}</AvatarFallback>
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
                      <AvatarFallback>{post.author.username}</AvatarFallback>
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
                    <DropdownMenuItem>
                      <Trash />
                      <p>Xóa</p>
                    </DropdownMenuItem>
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
              <p className="pl-12 text-base text-wrap break-words whitespace-pre-wrap break-all">
                {post?.content}
              </p>
              {post?.file && (
                <DialogReviewImage imageUrl={post.file}>
                  <div
                    // href={`/review-image?imageUrl=${post.file}`}
                    className="pl-12 w-full max-h-[500px] relative overflow-hidden cursor-pointer hover:opacity-75 duration-500 ease-in-out transition-all"
                  >
                    <Image
                      src={post?.file}
                      alt=""
                      width={500}
                      height={500}
                      className="w-full object-cover rounded-lg"
                    />
                  </div>
                </DialogReviewImage>
              )}
              <div className="ml-8 flex items-center gap-x-4">
                <Button className="rounded-full" variant="ghost">
                  <Heart />
                  <p>0</p>
                </Button>
                <Button className="rounded-full" variant="ghost">
                  <MessageCircle />
                  <p>0</p>
                </Button>
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
        ))}
    </div>
  );
};

export default Posts;
