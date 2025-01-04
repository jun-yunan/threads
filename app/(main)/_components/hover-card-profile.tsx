import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Doc } from '@/convex/_generated/dataModel';

import CardProfile from './card-profile';

export function HoverCardProfile({
  children,
  information,
}: {
  children?: React.ReactNode;
  information: Doc<'users'>;
}) {
  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <CardProfile information={information} />
      </HoverCardContent>
    </HoverCard>
  );
}
