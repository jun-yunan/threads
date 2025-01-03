import { ConvexError, v } from 'convex/values';
import { mutation } from './_generated/server';

export const create = mutation({
  args: {
    content: v.string(),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { content, published } = args;

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
      updatedAt: Date.now(),
    });

    if (!post) {
      throw new ConvexError('Failed to create post');
    }

    return post;
  },
});
