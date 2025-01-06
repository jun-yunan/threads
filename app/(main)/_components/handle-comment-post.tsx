import { Button } from '@/components/ui/button';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { MessageCircle } from 'lucide-react';
import { FunctionComponent } from 'react';
import { DialogCommentPost } from './dialogs/dialog-comment-post';
import { api } from '@/convex/_generated/api';

type Post = (typeof api.posts.getByUsername._returnType)['page'][0];

interface HandleCommentPostProps {
  currentUser: Doc<'users'>;
  post: Post;
}

const HandleCommentPost: FunctionComponent<HandleCommentPostProps> = ({
  post,
  currentUser,
}) => {
  return (
    <DialogCommentPost post={post} currentUser={currentUser}>
      <Button className="rounded-full" variant="ghost">
        <MessageCircle />
        <p>0</p>
      </Button>
    </DialogCommentPost>
  );
};

export default HandleCommentPost;
