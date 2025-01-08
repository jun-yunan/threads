'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetUserWithoutCurrentUser } from '@/features/users/api/use-get-user-without-current-user';
import useDebounce from '@/hooks/useDebounce';
import { Loader2, Search, SlidersHorizontal, UserPlus } from 'lucide-react';
import { FunctionComponent, useEffect, useState } from 'react';
import RendererUser from '../_components/renderer-user';
import { useSearchUsers } from '@/features/users/api/use-search-users';
import { api } from '@/convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { handle } from 'hono/vercel';
import ToggleFollow from '../_components/toggle-follow';
import { useGetCurrentUser } from '@/features/users/api/use-get-current-user';

interface SearchPageProps {}

type SearchResultsType = (typeof api.users.searchUsers._returnType)[0];

const SearchPage: FunctionComponent<SearchPageProps> = () => {
  const [searchText, setSearchText] = useState('');
  const [searchUsers, setSearchUsers] = useState<
    SearchResultsType[] | undefined
  >([]);

  const searchTextDebounce = useDebounce(searchText, 300);

  const { data: users, isLoading } = useGetUserWithoutCurrentUser();

  const { data: searchResults, isLoading: isLoadingSearchUsers } =
    useSearchUsers(searchTextDebounce);

  const { data: currentUser } = useGetCurrentUser();

  useEffect(() => {
    if (searchTextDebounce.trim() !== '') {
      setSearchUsers(searchResults);
    } else {
      setSearchUsers(undefined);
    }
  }, [searchResults, searchText, searchTextDebounce]);

  return (
    <div className="w-full p-4 flex flex-col items-start gap-y-4">
      <div className="w-full flex items-center border-2 px-3 rounded-xl py-1">
        <Search className="w-4 h-4 opacity-70" />
        <Input
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          placeholder="Tìm kiếm..."
          className="border-none focus-visible:ring-0 shadow-none"
        />
        <Button variant="ghost" size="icon" className="rounded-lg">
          <SlidersHorizontal />
        </Button>
      </div>
      <div>
        <p className="text-sm font-semibold">Gợi ý theo dõi</p>
      </div>
      {!searchText && (
        <div className="w-full flex flex-col items-start gap-y-4">
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            users?.map((user) => (
              <RendererUser
                key={user._id}
                currentUser={currentUser}
                user={user}
              />
            ))
          )}
        </div>
      )}

      {isLoadingSearchUsers ? (
        <Loader2 className="animate-spin" />
      ) : (
        searchResults &&
        searchResults.length > 0 && (
          <div className="w-full flex flex-col items-start gap-y-4">
            {searchUsers?.map((user) => (
              <div
                key={user._id}
                className="w-full flex items-center justify-between border-b-2 py-3"
              >
                <div className="flex items-center gap-x-2">
                  <Avatar className="w-11 h-11">
                    <AvatarImage src={user.imageUrl} alt={user.username} />
                    <AvatarFallback>
                      <Loader2 className="animate-spin" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col items-start justify-between">
                    <Link
                      href={`/${user.username}`}
                      className="lg:text-base text-sm font-semibold hover:underline"
                    >
                      {user.username}
                    </Link>
                    <p className="text-sm text-muted-foreground">{user.name}</p>
                  </div>
                </div>
                {currentUser && (
                  <ToggleFollow
                    followeeId={user._id}
                    followerId={currentUser._id}
                  />
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
