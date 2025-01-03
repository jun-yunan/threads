'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FunctionComponent } from 'react';
import { DialogCreateNewFeed } from '../_components/dialogs/dialog-create-new-feed';
import Posts from './_components/posts';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Separator } from '@/components/ui/separator';

interface DashboardPageProps {}

const DashboardPage: FunctionComponent<DashboardPageProps> = () => {
  const currentUser = useQuery(api.user.getCurrentUser);

  return (
    <Card className="lg:w-[40%] w-full mt-16">
      <DialogCreateNewFeed>
        <div className="flex items-center justify-between gap-x-3 p-4">
          <Avatar>
            <AvatarImage
              src={currentUser?.imageUrl}
              alt={currentUser?.username}
            />
            <AvatarFallback>{currentUser?.username}</AvatarFallback>
          </Avatar>
          <div className="w-full">
            <p>Có gì mới?</p>
          </div>

          <Button>Đăng</Button>
        </div>
      </DialogCreateNewFeed>
      <Separator />
      <Posts />
    </Card>
  );
};

export default DashboardPage;
