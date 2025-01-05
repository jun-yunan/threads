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
import { Bookmark, ChevronDown, Heart, Plus, UserPlus } from 'lucide-react';
import { DialogCreateNewFeed } from './dialogs/dialog-create-new-feed';

interface HeaderProps {}

type Options = 'Dành cho bạn' | 'Đang theo dõi' | 'Đã thích' | 'Đã Lưu';

const Header: FunctionComponent<HeaderProps> = () => {
  const [selectedOption, setSelectedOption] = useState<Options>('Dành cho bạn');

  const handleSelect = useCallback((event: Event) => {
    event.preventDefault();
  }, []);

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-10 bg-neutral-900 w-full h-16 flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-x-2 text-lg font-semibold">
              <p>{selectedOption}</p>
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-3">
            <DropdownMenuRadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption as (value: string) => void}
            >
              <DropdownMenuRadioItem
                className="py-3 text-base font-semibold rounded-lg cursor-pointer"
                value="Dành cho bạn"
              >
                <p>Dành cho bạn</p>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                className="py-3 text-base font-semibold rounded-lg cursor-pointer flex items-center justify-between"
                value="Đang theo dõi"
              >
                <p>Đang theo dõi</p>
                <UserPlus />
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                className="py-3 text-base font-semibold rounded-lg cursor-pointer flex items-center justify-between"
                value="Đã thích"
              >
                <p>Đã thích</p>
                <Heart />
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                className="py-3 text-base font-semibold rounded-lg cursor-pointer flex items-center justify-between"
                value="Đã lưu"
              >
                <p>Đã lưu</p>
                <Bookmark />
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DialogCreateNewFeed>
              <DropdownMenuItem
                onSelect={handleSelect}
                className="py-3 text-base font-semibold rounded-lg cursor-pointer flex items-center justify-between"
              >
                <p>Tạo bảng feed mới</p>
                <div>
                  <Plus className="w-6 h-6" />
                </div>
              </DropdownMenuItem>
            </DialogCreateNewFeed>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default Header;
