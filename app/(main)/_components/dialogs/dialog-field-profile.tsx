import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { schemaUpdateProfile } from '@/schema/form';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  children?: React.ReactNode;
  form: UseFormReturn<z.infer<typeof schemaUpdateProfile>>;
  type: 'bio' | 'name' | 'link';
}

export function DialogFieldProfile({ children, form, type }: Props) {
  const onSubmit = (data: z.infer<typeof schemaUpdateProfile>) => {};
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[600px]">
        <DialogHeader>
          {type === 'bio' && <DialogTitle>Chỉnh sửa tiểu sử</DialogTitle>}
          {type === 'link' && <DialogTitle>Chỉnh sửa liên kết</DialogTitle>}
        </DialogHeader>

        {type === 'bio' && (
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea rows={7} placeholder="Viết tiểu sử..." {...field} />
                </FormControl>
                <FormDescription>
                  Tiểu sử của bạn sẽ hiển thị công khai.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === 'link' && (
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    rows={7}
                    placeholder="https://www.example.com/"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Liên kết của bạn sẽ hiển thị công khai.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <DialogFooter>
          <Button type="button" onClick={() => setOpen(false)}>
            Xong
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
