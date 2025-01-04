import { Doc } from '@/convex/_generated/dataModel';
import { FunctionComponent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarDays, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface CardProfileProps {
  information: Doc<'users'>;
}

const CardProfile: FunctionComponent<CardProfileProps> = ({ information }) => {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex gap-x-4">
        <Avatar>
          <AvatarImage src={information.imageUrl} />
          <AvatarFallback>{information.username}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start gap-y-1">
          <Link
            href={`${information.username}`}
            className="text-sm font-semibold hover:underline"
          >
            {information.username}
          </Link>
          <p className="text-muted-foreground">{information.email}</p>
          <p className="text-sm">{information.bio}</p>
          <div className="flex items-center pt-2">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-xs text-muted-foreground">
              {format(new Date(information._creationTime), 'dd/MM/yyyy')}
            </span>
          </div>
          <p className="text-sm mt-2">0 Người theo dõi</p>
        </div>
      </div>
      <Button size="sm" className="text-sm rounded-lg">
        <UserPlus />
        Theo dõi
      </Button>
    </div>
  );
};

export default CardProfile;
