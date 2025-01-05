import { useGetPostsByUsername } from '@/features/post/api/use-get-posts-by-username';
import { useIsMobile } from '@/hooks/use-mobile';
import { useModalStore } from '@/hooks/use-modal-store';
import { useRouter } from 'next/navigation';
import { FunctionComponent } from 'react';
import DialogDeletePost from '../../_components/dialogs/dialog-delete-post';
import RendererPosts from '../../_components/renderer-posts';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { SkeletonFeed } from '../../_components/skeleton-feed';
import { Loader2 } from 'lucide-react';

interface PostsByUsernameProps {
  username: string;
}

const PostsByUsername: FunctionComponent<PostsByUsernameProps> = ({
  username,
}) => {
  const { results, loadMore, status } = useGetPostsByUsername({ username });

  const currentUser = useQuery(api.users.getCurrentUser);

  return (
    <>
      <DialogDeletePost />
      {results ? (
        <RendererPosts currentUser={currentUser} posts={results} />
      ) : (
        <Loader2 className="animate-spin" />
      )}
    </>
  );
};

export default PostsByUsername;
