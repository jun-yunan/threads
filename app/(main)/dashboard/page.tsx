import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FunctionComponent } from 'react';
import { DialogCreateNewFeed } from '../_components/dialogs/dialog-create-new-feed';

interface DashboardPageProps {}

const DashboardPage: FunctionComponent<DashboardPageProps> = () => {
  return (
    <Card className="w-[50%]">
      <DialogCreateNewFeed>
        <div className="flex items-center justify-between gap-x-3 p-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="w-full">
            <p>Có gì mới?</p>
          </div>

          <Button>Đăng</Button>
        </div>
      </DialogCreateNewFeed>
    </Card>
  );
};

export default DashboardPage;
