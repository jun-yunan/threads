'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { FileImage, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
// import

const schemaCreateNewFeed = z.object({
  content: z.string().min(1).max(500),
});

export function DialogCreateNewFeed({
  onOpen,
  open,
  children,
}: {
  open?: boolean;
  onOpen?: () => void;
  children?: React.ReactNode;
}) {
  const currentUser = useQuery(api.user.getCurrentUser);

  const form = useForm<z.infer<typeof schemaCreateNewFeed>>({
    defaultValues: {
      content: '',
    },
    resolver: zodResolver(schemaCreateNewFeed),
  });

  console.log(currentUser);

  const onSubmit = async (data: z.infer<typeof schemaCreateNewFeed>) => {
    console.log(data);
  };
  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target;

    if (selectionStart !== null) {
      form.setValue('content', value);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[600px]">
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
                <AvatarFallback>{currentUser?.name}</AvatarFallback>
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
                          maxRows={7}
                          maxLength={500}
                          {...field}
                          onChange={handleInputChange}
                          onClick={handleInputChange}
                          placeholder="Có gì mới?"
                          className="min-h-full w-full overflow-y-hidden resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground py-1.5"
                        />
                      </FormControl>
                      <FormDescription>
                        <p>{form.getValues('content').length}/500 Ký tự</p>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-x-2">
                  <Button type="button" variant="ghost" size="icon">
                    <FileImage />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-lg"
                  >
                    #
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
              <Button type="submit">Đăng</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}