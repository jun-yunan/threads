import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const toggle = mutation({
  args: {
    postId: v.id('posts'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const { postId, userId } = args;

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new ConvexError('User not found');
    }

    const post = await ctx.db.get(postId);

    if (!post) {
      throw new ConvexError('Post not found');
    }

    const like = await ctx.db
      .query('likes')
      .withIndex('by_post_id_user_id', (q) =>
        q.eq('postId', postId).eq('userId', userId),
      )
      .unique();

    if (like) {
      await ctx.db.delete(like._id);
    } else {
      await ctx.db.insert('likes', {
        postId,
        userId,
      });
    }
  },
});

export const getLikesPostById = query({
  args: {
    userId: v.id('users'),
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const { userId, postId } = args;

    const [user, post] = await Promise.all([
      ctx.db.get(userId),
      ctx.db.get(postId),
    ]);

    if (!user || !post) {
      throw new ConvexError('User or Post not found');
    }

    const likes = await ctx.db
      .query('likes')
      .withIndex('by_post_id', (q) => q.eq('postId', postId))
      .collect();

    return likes;
  },
});

export const getIsLikedPost = query({
  args: {
    userId: v.id('users'),
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const { userId, postId } = args;

    const [user, post] = await Promise.all([
      ctx.db.get(userId),
      ctx.db.get(postId),
    ]);

    if (!user || !post) {
      throw new ConvexError('User or Post not found');
    }

    const liked = await ctx.db
      .query('likes')
      .withIndex('by_post_id_user_id', (q) =>
        q.eq('postId', postId).eq('userId', userId),
      )
      .unique();

    return !!liked;
  },
});
