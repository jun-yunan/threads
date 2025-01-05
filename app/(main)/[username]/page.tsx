'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Instagram, SquareKanban } from 'lucide-react';
import { FunctionComponent, use, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogCreateNewFeed } from '../_components/dialogs/dialog-create-new-feed';
import PostsByUsername from './_components/posts-by-username';
import { Separator } from '@/components/ui/separator';
import { useModalStore } from '@/hooks/use-modal-store';
import { DialogUpdateProfile } from '../_components/dialogs/dialog-update-profile';

type Params = Promise<{ username: string }>;

interface ProfilePageProps {
  params: Params;
}

const ProfilePage: FunctionComponent<ProfilePageProps> = (props) => {
  const params = use(props.params);

  const username = useMemo(() => decodeURIComponent(params.username), [params]);

  const currentUser = useQuery(api.users.getCurrentUser);

  const userByUsername = useQuery(api.users.getUserByUsername, { username });

  const isCurrentUser = useMemo(
    () => currentUser?.username === userByUsername?.username,
    [currentUser, userByUsername],
  );

  const user = useMemo(
    () => (isCurrentUser ? currentUser : userByUsername),
    [currentUser, userByUsername, isCurrentUser],
  );

  const reposts = useQuery(api.reposts.getRepostsByUsername, { username });

  const { onOpen } = useModalStore();

  return (
    <>
      {isCurrentUser && <DialogUpdateProfile currentUser={currentUser} />}
      <div className="w-full h-full flex flex-col">
        <div className="w-full flex-col flex gap-y-6 p-6">
          {user && (
            <div className="w-full flex flex-col gap-y-2">
              <div className="w-full flex items-center justify-between">
                <div className="flex flex-col items-start justify-around">
                  <p className="text-2xl font-bold">{user.name}</p>
                  <p className="text-base font-light">{user.username}</p>
                </div>
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.imageUrl!} className="object-cover" />
                  <AvatarFallback>{user.username}</AvatarFallback>
                </Avatar>
              </div>
              <p className="text-sm text-ellipsis text-wrap break-words ">
                {user.bio}
              </p>
            </div>
          )}
          <div className="w-full flex items-center justify-between">
            <p className="text-base">0 Người theo dõi</p>
            <div className="flex gap-x-2 items-center">
              <SquareKanban className="w-6 h-6" />

              <Instagram className="w-6 h-6" />
            </div>
          </div>
          {isCurrentUser ? (
            <Button
              variant="outline"
              size="default"
              className="text-sm font-semibold"
              onClick={() => onOpen('updateProfile')}
            >
              Chỉnh sửa trang cá nhân
            </Button>
          ) : (
            <div className="w-full flex items-center gap-x-3">
              <Button size="default" className="w-full text-sm font-semibold">
                Theo dõi
              </Button>
              <Button
                variant="outline"
                size="default"
                className="w-full text-sm font-semibold"
              >
                Nhắn tin
              </Button>
            </div>
          )}
        </div>
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="w-full flex items-center justify-around">
            <TabsTrigger value="feed" className="text-base">
              Bảng tin
            </TabsTrigger>
            <TabsTrigger value="feed-reply" className="text-base">
              Trả lời bảng tin
            </TabsTrigger>
            <TabsTrigger value="repost" className="text-base">
              Đăng lại
            </TabsTrigger>
          </TabsList>
          <TabsContent value="feed" className="w-full min-h-[350px]">
            {user && isCurrentUser && (
              <DialogCreateNewFeed>
                <div className="cursor-pointer flex items-center justify-between gap-x-3 p-4">
                  <Avatar>
                    <AvatarImage src={user.imageUrl!} alt={user?.username} />
                    <AvatarFallback>{user?.username}</AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <p>Có gì mới?</p>
                  </div>

                  <Button variant="outline">Đăng</Button>
                </div>
              </DialogCreateNewFeed>
            )}
            <Separator />
            <PostsByUsername username={username} />
          </TabsContent>
          <TabsContent
            value="feed-reply"
            className="w-full min-h-[350px]"
          ></TabsContent>
          <TabsContent value="repost" className="w-full min-h-[350px]">
            {reposts && reposts.length > 0 ? (
              <div></div>
            ) : (
              <div className="w-full my-auto flex items-center justify-center">
                <p>Chưa có bài đăng lại nào</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProfilePage;
