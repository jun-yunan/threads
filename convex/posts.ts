import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import { userAgent } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const create = mutation({
  args: {
    content: v.string(),
    published: v.boolean(),
    image: v.optional(v.id('_storage')),
    location: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { content, published, image, location, tags } = args;

    if (!content || !published) {
      throw new ConvexError('Content and published are required');
    }

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    const post = await ctx.db.insert('posts', {
      authorId: currentUser._id,
      content,
      published,
      image,
      location,
      tags,
      updatedAt: Date.now(),
    });

    if (!post) {
      throw new ConvexError('Failed to create post');
    }

    // await ctx.db.patch(currentUser._id, {
    //   posts: [post, ...(currentUser.posts || [])],
    // });

    return post;
  },
});

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    const posts = await ctx.db
      .query('posts')
      .withIndex('by_published', (q) => q.eq('published', true))
      .order('desc')
      .paginate(args.paginationOpts);

    return {
      ...posts,
      page: await Promise.all(
        posts.page.map(async (post) => {
          const author = await ctx.db
            .query('users')
            .withIndex('by_id', (q) => q.eq('_id', post.authorId))
            .unique();

          if (!author) {
            return null;
          }

          const generatePostImageUrl = post.image
            ? await ctx.storage.getUrl(post.image)
            : undefined;

          const generateUserImageUrl = author.imageStorageId
            ? await ctx.storage.getUrl(author.imageStorageId)
            : author.imageUrl;

          const authorIncludeImageUrl = {
            ...author,
            imageUrl: generateUserImageUrl!,
          };

          return {
            ...post,
            author: authorIncludeImageUrl,
            image: generatePostImageUrl,
          };
        }),
      ),
    };
  },
});

export const getByUsername = query({
  args: {
    username: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .unique();

    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    const posts = await ctx.db
      .query('posts')
      .withIndex('by_author_id', (q) => q.eq('authorId', currentUser._id))
      .order('desc')
      .paginate(args.paginationOpts);

    return {
      ...posts,
      page: await Promise.all(
        posts.page.map(async (post) => {
          const author = await ctx.db
            .query('users')
            .withIndex('by_id', (q) => q.eq('_id', post.authorId))
            .unique();

          if (!author) {
            return null;
          }

          const generatePostImageUrl = post.image
            ? await ctx.storage.getUrl(post.image)
            : undefined;

          const generateUserImageUrl = author.imageStorageId
            ? await ctx.storage.getUrl(author.imageStorageId)
            : author.imageUrl;

          const authorIncludeImageUrl = {
            ...author,
            imageUrl: generateUserImageUrl!,
          };

          return {
            ...post,
            author: authorIncludeImageUrl,
            image: generatePostImageUrl,
          };
        }),
      ),
    };
  },
});

export const getById = query({
  args: {
    username: v.string(),
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .unique();

    if (!user) {
      throw new ConvexError('User not found');
    }

    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new ConvexError('Post not found');
    }

    const generatePostImageUrl = post.image
      ? await ctx.storage.getUrl(post.image)
      : undefined;

    const generateUserImageUrl = user.imageStorageId
      ? await ctx.storage.getUrl(user.imageStorageId)
      : user.imageUrl;

    const authorIncludeImageUrl = {
      ...user,
      imageUrl: generateUserImageUrl!,
    };

    return {
      ...post,
      image: generatePostImageUrl,
      author: authorIncludeImageUrl,
    };
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const { postId } = args;

    if (!postId) {
      throw new ConvexError('Post ID is required');
    }

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    const post = await ctx.db.get(postId);

    if (!post) {
      throw new ConvexError('Post not found');
    }

    await ctx.db.delete(post._id);
  },
});
