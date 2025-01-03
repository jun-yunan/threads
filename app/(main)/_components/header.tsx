'use client';

import { FunctionComponent } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  return (
    <div className="fixed top-0 right-0 left-0 z-10 bg-neutral-900 w-full h-16 flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center gap-x-2 text-lg font-semibold">
            <p>Dành cho bạn</p>
            <ChevronDown />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Dành cho bạn</DropdownMenuItem>
          <DropdownMenuItem>Đang theo dõi</DropdownMenuItem>
          <DropdownMenuItem>Đã thích</DropdownMenuItem>
          <DropdownMenuItem>Đã Lưu</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Tạo bảng feed mới</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
