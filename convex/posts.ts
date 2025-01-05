import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import { userAgent } from 'next/server';

export const create = mutation({
  args: {
    content: v.string(),
    published: v.boolean(),
    storageId: v.optional(v.id('_storage')),
    formatFile: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { content, published, storageId, formatFile } = args;

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
      author: currentUser._id,
      content,
      published,
      formatFile,
      storageId,
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
            .withIndex('by_id', (q) => q.eq('_id', post.author))
            .unique();

          if (!author) {
            return null;
          }

          const file = post.storageId
            ? await ctx.storage.getUrl(post.storageId)
            : undefined;

          return {
            ...post,
            author,
            file,
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
      .withIndex('by_author', (q) => q.eq('author', currentUser._id))
      .order('desc')
      .paginate(args.paginationOpts);

    return {
      ...posts,
      page: await Promise.all(
        posts.page.map(async (post) => {
          const author = await ctx.db
            .query('users')
            .withIndex('by_id', (q) => q.eq('_id', post.author))
            .unique();

          if (!author) {
            return null;
          }

          const file = post.storageId
            ? await ctx.storage.getUrl(post.storageId)
            : undefined;

          return {
            ...post,
            author,
            file,
          };
        }),
      ),
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
