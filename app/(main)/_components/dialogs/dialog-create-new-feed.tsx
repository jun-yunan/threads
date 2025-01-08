'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import TextareaAutoSize from 'react-textarea-autosize';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { FileImage, Loader2, MapPin, Smile, X } from 'lucide-react';
import { useCreatePost } from '@/features/post/api/use-create-post';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { EmojiPopover } from '../emoji-popover';
import { useGenerateUpload } from '@/features/upload/api/use-generate-upload';
import { Id } from '@/convex/_generated/dataModel';

const schemaCreateNewFeed = z.object({
  content: z.string().min(1).max(500),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export function DialogCreateNewFeed({
  children,
}: {
  children?: React.ReactNode;
}) {
  const currentUser = useQuery(api.users.getCurrentUser);

  const [isPending, setIsPending] = useState(false);

  const [open, setOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: mutationCreatePost } = useCreatePost();

  const form = useForm<z.infer<typeof schemaCreateNewFeed>>({
    defaultValues: {
      content: '',
    },
    resolver: zodResolver(schemaCreateNewFeed),
  });

  const { mutate: generateUploadUrl } = useGenerateUpload();
  const onSubmit = async (data: z.infer<typeof schemaCreateNewFeed>) => {
    try {
      setIsPending(true);
      let image: Id<'_storage'> | undefined;
      if (file) {
        const postUrl = await generateUploadUrl({}, { throwError: true });

        if (!postUrl) {
          throw new Error('Url not found');
        }

        const result = await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error('Error uploading file');
        }

        const { storageId } = await result.json();
        image = storageId;
      }
      mutationCreatePost({
        content: data.content,
        published: true,
        image,
        location: data.location,
        tags: data.tags,
      });

      toast.success('Đăng bài thành công');
    } catch (error) {
      console.log(error);
      toast.error('Đăng bài thất bại');
    } finally {
      setIsPending(false);
      setOpen(false);
    }
  };
  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target;

    if (selectionStart !== null) {
      form.setValue('content', value);
    }
  };

  const onEmojiSelect = (emoji: any) => {
    form.setValue('content', form.getValues('content') + emoji.native);
  };

  useEffect(() => {
    if (!open) {
      form.reset();
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }, [form, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>New Feed</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="flex items-center gap-x-2 w-full ">
              <Avatar className="self-start">
                <AvatarImage
                  src={currentUser?.imageUrl}
                  alt={currentUser?.name}
                />
                <AvatarFallback>
                  <Loader2 className="animate-spin" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-between items-start w-full">
                <p className="lg:text-base text-sm font-semibold">
                  {currentUser?.username}
                </p>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="w-full h-full">
                      <FormControl>
                        <TextareaAutoSize
                          rows={1}
                          maxRows={6}
                          maxLength={500}
                          {...field}
                          onChange={handleInputChange}
                          onClick={handleInputChange}
                          placeholder="Có gì mới?"
                          className="min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground py-1.5"
                        />
                      </FormControl>
                      <FormDescription>
                        {form.getValues('content').length}/500 Ký tự
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {file && (
                  <div className="relative w-full h-[250px]">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="image"
                      width={300}
                      height={300}
                      className="w-full h-full rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full"
                      onClick={() => {
                        setFile(null);
                        if (inputRef.current) {
                          inputRef.current.value = '';
                        }
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => inputRef.current?.click()}
                  >
                    <FileImage />
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={inputRef}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        setFile(file);
                      }
                    }}
                  />
                  <EmojiPopover onEmojiSelect={onEmojiSelect}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-lg"
                    >
                      <Smile />
                    </Button>
                  </EmojiPopover>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-lg"
                  >
                    <p>#</p>
                  </Button>
                  <Button type="button" variant="ghost" size="icon">
                    <MapPin />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <Button type="button" variant="ghost" size="default">
                Bất kỳ ai cũng có thể trả lời trích dẫn
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <Loader2 className="animate-spin"></Loader2>
                ) : (
                  'Đăng'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
