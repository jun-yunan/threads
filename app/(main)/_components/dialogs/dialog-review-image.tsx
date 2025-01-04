import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import Image from 'next/image';

export function DialogReviewImage({
  children,
  imageUrl,
}: {
  children?: React.ReactNode;
  imageUrl: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[600px] max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Review Image</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Image
          src={imageUrl}
          alt=""
          width={600}
          height={700}
          className="object-cover w-full h-full rounded-lg "
        />
      </DialogContent>
    </Dialog>
  );
}
