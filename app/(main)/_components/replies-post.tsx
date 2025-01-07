import { Button } from '@/components/ui/button';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { MessageCircle } from 'lucide-react';
import { FunctionComponent } from 'react';
import { DialogRepliesPost } from './dialogs/dialog-replies-post';
import { api } from '@/convex/_generated/api';

type Post = (typeof api.posts.getByUsername._returnType)['page'][0];

interface RepliesPostProps {
  currentUser: Doc<'users'>;
  post: Post;
}

const RepliesPost: FunctionComponent<RepliesPostProps> = ({
  post,
  currentUser,
}) => {
  return (
    <DialogRepliesPost post={post} currentUser={currentUser}>
      <Button className="rounded-full" variant="ghost">
        <MessageCircle />
        <p>0</p>
      </Button>
    </DialogRepliesPost>
  );
};

export default RepliesPost;
