'use client';

import { FunctionComponent } from 'react';
import { useGetPosts } from '@/features/post/api/use-get-posts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat,
  Send,
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

interface PostsProps {}

const Posts: FunctionComponent<PostsProps> = () => {
  const { results, loadMore, status } = useGetPosts({});

  return (
    <div className="flex w-full flex-col gap-y-4 p-4">
      {results &&
        results.map((post) => (
          <div key={post?._id} className="w-full flex flex-col gap-y-2">
            <div className="w-full flex justify-between">
              <div className="flex items-center gap-x-2">
                <Avatar>
                  <AvatarImage
                    src={post?.author.imageUrl}
                    alt={post?.author.username}
                  />
                  <AvatarFallback>{post?.author.username}</AvatarFallback>
                </Avatar>
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
                <DropdownMenuTrigger>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="self-start rounded-full"
                  >
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Lưu</DropdownMenuItem>
                  <DropdownMenuItem>Không quan tâm</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Tắt thông báo</DropdownMenuItem>
                  <DropdownMenuItem>Chặn</DropdownMenuItem>
                  <DropdownMenuItem>Báo cáo</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sao chép liên kết</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="ml-12 w-full flex flex-col items-start gap-y-2 ">
              <p className="text-base text-wrap break-words whitespace-pre-wrap break-all">
                {post?.content}
              </p>
              <div className="flex items-center gap-x-4">
                <Button className="rounded-full" size="default" variant="ghost">
                  <Heart />
                  <p>0</p>
                </Button>
                <Button className="rounded-full" size="default" variant="ghost">
                  <MessageCircle />
                  <p>0</p>
                </Button>
                <Button className="rounded-full" size="default" variant="ghost">
                  <Repeat />
                  <p>0</p>
                </Button>
                <Button className="rounded-full" size="default" variant="ghost">
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
