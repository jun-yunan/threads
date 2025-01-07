'use client';

import { FunctionComponent, useCallback, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bookmark,
  ChevronDown,
  Heart,
  Menu,
  Plus,
  UserPlus,
} from 'lucide-react';
import { DialogCreateNewFeed } from './dialogs/dialog-create-new-feed';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeaderProps {}

type Options = 'Dành cho bạn' | 'Đang theo dõi' | 'Đã thích' | 'Đã Lưu';

const Header: FunctionComponent<HeaderProps> = () => {
  const [selectedOption, setSelectedOption] = useState<Options>('Dành cho bạn');

  const handleSelect = useCallback((event: Event) => {
    event.preventDefault();
  }, []);

  const { theme } = useTheme();

  const isMobile = useIsMobile();

  return (
    <>
      <div
        className={cn(
          'fixed top-0 right-0 left-0 z-10 w-full h-16 flex items-center justify-center',
          theme === 'dark' ? 'bg-black/90' : 'bg-white',
          isMobile && 'flex items-center justify-between px-2',
        )}
      >
        {isMobile && (
          <Link href="/dashboard" className="text-base font-bold animate-pulse">
            <p>NAKIET</p>
          </Link>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-x-2 text-base lg:text-lg font-semibold">
              <p>{selectedOption}</p>
              <ChevronDown className="w-4 h-4 lg:w-6 lg:h-6" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="lg:w-64 w-52 p-3">
            <DropdownMenuRadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption as (value: string) => void}
            >
              <DropdownMenuRadioItem
                className="py-3 text-sm lg:text-base font-semibold rounded-lg cursor-pointer"
                value="Dành cho bạn"
              >
                <p>Dành cho bạn</p>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                className="py-3 text-sm lg:text-base font-semibold rounded-lg cursor-pointer flex items-center justify-between"
                value="Đang theo dõi"
              >
                <p>Đang theo dõi</p>
                <UserPlus className="w-4 h-4 lg:w-6 lg:h-6" />
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                className="py-3 text-sm lg:text-base font-semibold rounded-lg cursor-pointer flex items-center justify-between"
                value="Đã thích"
              >
                <p>Đã thích</p>
                <Heart className="w-4 h-4 lg:w-6 lg:h-6" />
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                className="py-3 text-sm lg:text-base font-semibold rounded-lg cursor-pointer flex items-center justify-between"
                value="Đã lưu"
              >
                <p>Đã lưu</p>
                <Bookmark className="w-4 h-4 lg:w-6 lg:h-6" />
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DialogCreateNewFeed>
              <DropdownMenuItem
                onSelect={handleSelect}
                className="py-3 text-sm lg:text-base font-semibold rounded-lg cursor-pointer flex items-center justify-between"
              >
                <p>Tạo bảng feed mới</p>
                <div>
                  <Plus className="lg:w-6 lg:h-6" />
                </div>
              </DropdownMenuItem>
            </DialogCreateNewFeed>
          </DropdownMenuContent>
        </DropdownMenu>
        {isMobile && (
          <Button className="" variant="ghost" size="icon">
            <Menu />
          </Button>
        )}
      </div>
    </>
  );
};

export default Header;
