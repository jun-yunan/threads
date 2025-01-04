'use client';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FunctionComponent, use } from 'react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface ReviewImagePageProps {
  searchParams: SearchParams;
}

const ReviewImagePage: FunctionComponent<ReviewImagePageProps> = (props) => {
  const router = useRouter();
  const searchParams = use(props.searchParams);
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <Button
        onClick={() => router.back()}
        className="absolute top-2 left-2 rounded-full"
        size="icon"
        variant="ghost"
      >
        <X />
      </Button>
      <p>{searchParams.imageUrl}</p>
      {/* {<Image src={imageUrl} fill alt="" />} */}
    </div>
  );
};

export default ReviewImagePage;
