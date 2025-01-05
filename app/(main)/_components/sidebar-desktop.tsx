'use client';

import { Heart, House, Menu, Pin, Plus, Search, UserRound } from 'lucide-react';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { ToggleTheme } from './toggle-theme';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DialogCreateNewFeed } from './dialogs/dialog-create-new-feed';
import { useGetCurrentUser } from '@/features/user/api/use-get-current-user';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const sidebarItems = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: <House className="w-6 h-6" />,
  },
  {
    title: 'Search',
    url: '/search',
    icon: <Search className="w-6 h-6" />,
  },
  {
    title: 'Create',
    url: '/add-new-feed',
    icon: <Plus className="w-6 h-6" />,
  },
  {
    title: 'Favorites',
    url: '/favorites',
    icon: <Heart className="w-6 h-6" />,
  },
  {
    title: 'Profile',
    url: '/profile',
    icon: <UserRound className="w-6 h-6" />,
  },
];

interface SidebarDesktopProps {}

const SidebarDesktop: FunctionComponent<SidebarDesktopProps> = () => {
  const pathname = usePathname();
  const currentUser = useQuery(api.users.getCurrentUser);
  return (
    <div className="fixed hidden top-0 bottom-0 z-20 left-0 md:flex flex-col items-center justify-between h-full px-3 py-4 bg-neutral-800 text-white">
      <Link href="/dashboard" className="text-lg font-bold animate-pulse">
        <p>NAKIET</p>
      </Link>
      <div className="flex flex-col gap-y-6">
        {sidebarItems.map((item, index) => {
          if (item.title === 'Profile') {
            return (
              <Link
                href={`/${currentUser?.username}`}
                key={index}
                className={cn(
                  'flex items-center gap-x-2 text-base font-semibold hover:bg-neutral-600 py-3 px-3 rounded-lg transition-all duration-500 ease-in-out',
                  pathname === `/${currentUser?.username}` && 'bg-neutral-600',
                )}
              >
                {item.icon}
              </Link>
            );
          }

          if (item.title === 'Create') {
            return (
              <DialogCreateNewFeed key={index}>
                <div
                  className={cn(
                    'cursor-pointer flex items-center gap-x-2 text-base font-semibold hover:bg-neutral-600 py-3 px-3 rounded-lg transition-all duration-500 ease-in-out',
                  )}
                >
                  {item.icon}
                </div>
              </DialogCreateNewFeed>
            );
          }

          return (
            <Link
              href={item.url}
              key={index}
              className={cn(
                'flex items-center gap-x-2 text-base font-semibold hover:bg-neutral-600 py-3 px-3 rounded-lg transition-all duration-500 ease-in-out',
                pathname === item.url && 'bg-neutral-600',
              )}
            >
              {item.icon}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-y-3">
        <ToggleTheme />
        <Pin className="w-6 h-6" />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default SidebarDesktop;
