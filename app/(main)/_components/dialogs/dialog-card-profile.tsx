import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Doc } from '@/convex/_generated/dataModel';

import CardProfile from '../card-profile';

export function DialogCardProfile({
  information,
  children,
}: {
  information: Doc<'users'>;
  children?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <CardProfile information={information} />
      </DialogContent>
    </Dialog>
  );
}
