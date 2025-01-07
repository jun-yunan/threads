'use client';
import { FunctionComponent } from 'react';
import { Heart, House, Menu, Pin, Plus, Search, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { DialogCreateNewFeed } from './dialogs/dialog-create-new-feed';

const sidebarItems = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: <House className="w-5 h-5" />,
  },
  {
    title: 'Search',
    url: '/search',
    icon: <Search className="w-5 h-5" />,
  },
  {
    title: 'Create',
    url: '/add-new-feed',
    icon: <Plus className="w-5 h-5" />,
  },
  {
    title: 'Favorites',
    url: '/favorites',
    icon: <Heart className="w-5 h-5" />,
  },
  {
    title: 'Profile',
    url: '/profile',
    icon: <UserRound className="w-5 h-5" />,
  },
];

interface NavMobileProps {}

const NavMobile: FunctionComponent<NavMobileProps> = () => {
  const pathname = usePathname();
  const currentUser = useQuery(api.users.getCurrentUser);
  return (
    <div className="fixed bottom-0 right-0 lg:hidden left-0 bg-white dark:bg-black w-full flex items-center justify-between px-2 py-3">
      {sidebarItems.map((item, index) => {
        if (item.title === 'Profile') {
          return (
            <Link
              href={item.url}
              key={index}
              className={cn(
                'flex items-center gap-x-2 text-base font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-600 py-3 px-3 rounded-lg transition-all duration-500 ease-in-out',
                pathname === `/${currentUser?.username}` &&
                  'dark:bg-neutral-600 bg-neutral-200',
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
                  'cursor-pointer flex items-center gap-x-2 text-base font-semibold border-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 py-3 px-3 rounded-lg transition-all duration-500 ease-in-out',
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
              'flex items-center gap-x-2 text-base font-semibold  hover:bg-neutral-200 dark:hover:bg-neutral-600 py-3 px-3 rounded-lg transition-all duration-500 ease-in-out',
              pathname === item.url && 'dark:bg-neutral-600 bg-neutral-200',
            )}
          >
            {item.icon}
          </Link>
        );
      })}
    </div>
  );
};

export default NavMobile;
