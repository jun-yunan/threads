'use client';

import { FunctionComponent } from 'react';
import { Doc } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import RendererPost from './renderer-post';

type Post = (typeof api.posts.getByUsername._returnType)['page'][0];

interface RendererPostsProps {
  currentUser: Doc<'users'> | undefined;
  posts: Post[];
}

const RendererPosts: FunctionComponent<RendererPostsProps> = ({
  currentUser,
  posts,
}) => {
  return (
    <div className="flex w-full flex-col gap-y-4 p-4">
      {posts &&
        posts.map((post) => (
          <RendererPost key={post?._id} currentUser={currentUser} post={post} />
        ))}
    </div>
  );
};

export default RendererPosts;
