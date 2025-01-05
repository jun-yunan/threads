import { FunctionComponent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useModalStore } from '@/hooks/use-modal-store';
import { toast } from 'sonner';
import { useDeletePost } from '@/features/post/api/use-delete-post';
import { Loader2 } from 'lucide-react';

interface DialogDeletePostProps {
  children?: React.ReactNode;
}

const DialogDeletePost: FunctionComponent<DialogDeletePostProps> = ({
  children,
}) => {
  const { onClose, isOpen, type, data } = useModalStore();

  const isOpenDialog = isOpen && type === 'deletePost';

  const handleClose = () => {
    onClose();
  };

  const { mutate: mutationDeletePost, isPending } = useDeletePost();

  const handleDeletePost = () => {
    try {
      if (data.postId) mutationDeletePost({ postId: data.postId });
      handleClose();
      toast.success('Xóa bài viết thành công.');
    } catch (error) {
      console.log(error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };
  return (
    <Dialog open={isOpenDialog} onOpenChange={handleClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa bài viết?</DialogTitle>
          <DialogDescription>
            Nếu xóa bài viết này, bạn sẽ không khôi phục được nữa.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onClose()}>
            Hủy
          </Button>
          <Button
            disabled={isPending}
            variant="destructive"
            onClick={handleDeletePost}
          >
            {isPending ? <Loader2 className="animate-spin" /> : 'Xóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeletePost;
