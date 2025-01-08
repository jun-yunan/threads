import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/convex/_generated/api';
import { Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { HoverCardProfile } from './hover-card-profile';
import ToggleFollow from './toggle-follow';

interface RendererUserProps {
  user: (typeof api.users.getUsersWithoutCurrentUser._returnType)[0];
  currentUser?: typeof api.users.getCurrentUser._returnType;
}

const RendererUser: FunctionComponent<RendererUserProps> = ({
  user,
  currentUser,
}) => {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="flex items-center gap-x-2">
        <HoverCardProfile information={user}>
          <Avatar className="w-11 h-11">
            <AvatarImage
              src={user.imageUrl}
              alt={user.username}
              className="object-cover hover:opacity-75 cursor-pointer duration-500 transition-all"
            />
            <AvatarFallback>
              <Loader2 className="animate-spin" />
            </AvatarFallback>
          </Avatar>
        </HoverCardProfile>
        <div className="flex flex-col items-start w-full justify-around">
          <div className="w-full flex items-center justify-between">
            <Link
              href={`/${user.username}`}
              className="lg:text-base text-sm hover:underline"
            >
              {user.username}
            </Link>
            {currentUser && (
              <ToggleFollow
                followeeId={user._id}
                followerId={currentUser._id}
              />
            )}
          </div>
          <p className="text-muted-foreground text-sm">{user.name}</p>
        </div>
      </div>
      <div className="w-full pl-14">
        <p>{user.bio}</p>
        <p>0 Người theo dõi</p>
      </div>
      <Separator />
    </div>
  );
};

export default RendererUser;
