import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { useModalStore } from '@/hooks/use-modal-store';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Loader2, Lock, Plus, Trash, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { schemaUpdateProfile } from '@/schema/form';
import { DialogFieldProfile } from './dialog-field-profile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useGenerateUpload } from '@/features/upload/api/use-generate-upload';
import { useUpdateUser } from '@/features/user/api/use-update-user';
import { toast } from 'sonner';

export function DialogUpdateProfile({
  children,
  currentUser,
}: {
  children?: React.ReactNode;
  currentUser?: Doc<'users'> | undefined | null;
}) {
  const { isOpen, type, onClose } = useModalStore();

  const { mutate: generateUploadUrl } = useGenerateUpload();
  const { mutate: mutationUpdateUser } = useUpdateUser();

  const [isPending, setIsPending] = useState(false);

  const [image, setImage] = useState<File | null>(null);

  const inputImageRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof schemaUpdateProfile>>({
    defaultValues: {
      bio: '',
      link: '',
      name: '',
      username: '',
    },
  });

  const isOpenDialog = useMemo(
    () => isOpen && type === 'updateProfile',
    [isOpen, type],
  );

  const handleClose = () => {
    onClose();
    form.reset();
    setImage(null);
    if (inputImageRef.current) {
      inputImageRef.current.value = '';
    }
  };

  useEffect(() => {
    form.setValue('bio', currentUser?.bio);
    form.setValue('link', currentUser?.link);
    form.setValue('name', currentUser?.name);
    form.setValue('username', currentUser?.username);
  }, [currentUser, form, isOpenDialog]);

  const onSubmit = async (data: z.infer<typeof schemaUpdateProfile>) => {
    if (!currentUser) return;
    try {
      setIsPending(true);

      let imageStorageId: Id<'_storage'> | undefined;

      if (image) {
        const postUrl = await generateUploadUrl({}, { throwError: true });

        if (!postUrl) {
          throw new Error('Url not found');
        }

        const result = await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error('Error uploading file');
        }

        const { storageId } = await result.json();

        imageStorageId = storageId;
      }

      mutationUpdateUser({
        userId: currentUser._id,
        ...data,
        imageStorageId,
      });

      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      console.log(error);

      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau');
    } finally {
      handleClose();
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpenDialog} onOpenChange={handleClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cập nhật hồ sơ cá nhân</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-y-4"
          >
            <div className="w-full  flex items-center justify-between cursor-pointer hover:bg-neutral-800 transition-all duration-500 p-2 rounded-lg">
              <div className="flex flex-col items-start gap-y-1 ">
                <Label className="text-base font-semibold">Tên</Label>
                <div className="flex items-center gap-x-2">
                  <Lock className="w-5 h-5" />
                  <p className="text-base">
                    {currentUser?.name} ({currentUser?.username})
                  </p>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={inputImageRef}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setImage(file);
                  }
                }}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-16 h-16 cursor-pointer hover:opacity-75 transition-all duration-500">
                    {image ? (
                      <AvatarImage
                        src={URL.createObjectURL(image)}
                        className="object-cover"
                      />
                    ) : (
                      <AvatarImage
                        src={currentUser?.imageUrl}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback>
                      <Loader2 className="animate-spin" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52">
                  <DropdownMenuItem
                    className="cursor-pointer text-base font-semibold"
                    onClick={() => inputImageRef.current?.click()}
                  >
                    <Upload className="w-6 h-6" />
                    Tải ảnh lên
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-base font-semibold text-rose-600 focus:text-rose-600 hover:text-rose-600">
                    <Trash className="w-6 h-6" />
                    Gỡ ảnh hiện tại
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator />
            <DialogFieldProfile form={form} type="bio">
              <div className="cursor-pointer hover:bg-neutral-800 transition-all duration-500 p-2 rounded-lg flex w-full flex-col items-start gap-y-1">
                <Label className="text-base font-semibold">Tiểu sử</Label>

                {currentUser?.bio ? (
                  <p className="text-base">{currentUser.bio}</p>
                ) : (
                  <div className="w-full flex items-center justify-start gap-x-2">
                    <Plus className="w-4 h-4" />
                    <p className="text-sm">
                      {form.watch('bio') ? form.watch('bio') : 'Viết tiểu sử'}
                    </p>
                  </div>
                )}
              </div>
            </DialogFieldProfile>
            <Separator />
            <DialogFieldProfile form={form} type="link">
              <div className="cursor-pointer hover:bg-neutral-800 transition-all duration-500 p-2 rounded-lg flex w-full flex-col items-start gap-y-1">
                <Label className="text-base font-semibold">Liên kết</Label>

                {currentUser?.link ? (
                  <Link
                    href={currentUser.link}
                    className="hover:underline text-blue-500"
                  >
                    {currentUser.link}
                  </Link>
                ) : (
                  <div className="w-full flex items-center justify-start gap-x-2">
                    <Plus className="w-4 h-4" />
                    {form.watch('link') ? form.watch('link') : 'Thêm liên kết'}
                  </div>
                )}
              </div>
            </DialogFieldProfile>
            <Separator />
            <Button
              disabled={isPending}
              type="submit"
              className="text-base font-semibold py-7"
            >
              {isPending ? <Loader2 /> : 'Cập nhật'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
