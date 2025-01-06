import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useToggleLikePost } from '@/features/likes/use-toggle-like-post';
import { useQuery } from 'convex/react';
import { Heart } from 'lucide-react';
import { FaHeart } from 'react-icons/fa';
import { FunctionComponent } from 'react';

interface ToggleLikePostProps {
  postId: Id<'posts'>;
  userId: Id<'users'>;
}

const ToggleLikePost: FunctionComponent<ToggleLikePostProps> = ({
  postId,
  userId,
}) => {
  const likes = useQuery(api.likes.getLikesPostById, { postId, userId });

  const isLiked = useQuery(api.likes.getIsLikedPost, { postId, userId });

  const { mutate: mutationToggleLikePost, isPending } = useToggleLikePost();

  const handleToggleLikePost = async () => {
    mutationToggleLikePost({ postId, userId });
  };

  return (
    <Button
      className="rounded-full"
      variant="ghost"
      onClick={handleToggleLikePost}
    >
      {isLiked ? <FaHeart className="text-rose-600" /> : <Heart />}
      <p>{likes && likes.length > 0 ? likes.length : 0}</p>
    </Button>
  );
};

export default ToggleLikePost;
