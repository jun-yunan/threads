'use client';

import { FunctionComponent } from 'react';
import { useGetPosts } from '@/features/post/api/use-get-posts';
import { Doc } from '@/convex/_generated/dataModel';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import DialogDeletePost from '../../_components/dialogs/dialog-delete-post';
import { useModalStore } from '@/hooks/use-modal-store';
import RendererPosts from '../../_components/renderer-posts';

interface PostsProps {
  currentUser: Doc<'users'> | undefined;
}

const Posts: FunctionComponent<PostsProps> = ({ currentUser }) => {
  const { results, loadMore, status } = useGetPosts({});
  const isMobile = useIsMobile();

  const router = useRouter();

  const { onOpen } = useModalStore();

  return (
    <>
      <DialogDeletePost />
      {results && <RendererPosts currentUser={currentUser} posts={results} />}
    </>
  );
};

export default Posts;
