import { ConvexError, v } from 'convex/values';
import { query } from './_generated/server';

export const getRepostsByUserId = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_id', (q) => q.eq('_id', args.userId))
      .unique();

    if (!user) {
      throw new ConvexError('User not found');
    }

    const reposts = await ctx.db
      .query('reposts')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .collect();

    return reposts;
  },
});

export const getRepostsByUsername = query({
  args: {
    username: v.string(),
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

    const reposts = await ctx.db
      .query('reposts')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .collect();

    return reposts;
  },
});
