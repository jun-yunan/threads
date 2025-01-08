import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const toggleFollow = mutation({
  args: {
    followerId: v.id('users'),
    followeeId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const { followerId, followeeId } = args;

    const follower = await ctx.db.get(followerId);

    if (!follower) {
      throw new ConvexError('Follower not found');
    }

    const followee = await ctx.db.get(followeeId);

    if (!followee) {
      throw new ConvexError('Followee not found');
    }

    const follow = await ctx.db
      .query('follows')
      .withIndex('by_follower_id_followee_id', (q) =>
        q.eq('followerId', followerId).eq('followeeId', followeeId),
      )
      .unique();

    if (follow) {
      await ctx.db.delete(follow._id);
    } else {
      await ctx.db.insert('follows', {
        followerId,
        followeeId,
        updatedAt: Date.now(),
      });
    }
  },
});

export const unFollow = mutation({
  args: {
    followerId: v.id('users'),
    followeeId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const { followerId, followeeId } = args;

    const follower = await ctx.db.get(followerId);

    if (!follower) {
      throw new ConvexError('Follower not found');
    }

    const followee = await ctx.db.get(followeeId);

    if (!followee) {
      throw new ConvexError('Followee not found');
    }

    const follow = await ctx.db
      .query('follows')
      .withIndex('by_follower_id_followee_id', (q) =>
        q.eq('followerId', followerId).eq('followeeId', followeeId),
      )
      .unique();

    if (follow) {
      await ctx.db.delete(follow._id);
    } else {
      throw new ConvexError('Follow not found');
    }
  },
});

export const isFollowing = query({
  args: {
    followerId: v.id('users'),
    followeeId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const { followerId, followeeId } = args;

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const follow = await ctx.db
      .query('follows')
      .withIndex('by_follower_id_followee_id', (q) =>
        q.eq('followerId', followerId).eq('followeeId', followeeId),
      )
      .unique();

    if (!follow) {
      return false;
    }
    return true;
  },
});

export const getFolloweesByUserId = query({
  args: {},
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const currentUser = await context.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    const followees = await context.db
      .query('follows')
      .withIndex('by_follower_id', (q) => q.eq('followerId', currentUser._id))
      .collect();

    if (!followees.length) {
      return [];
    }

    const postByFollowees = (
      await Promise.all(
        followees.map(async (followee) => {
          return await context.db
            .query('posts')
            .withIndex('by_author_id', (q) =>
              q.eq('authorId', followee.followeeId),
            )
            .collect();
        }),
      )
    ).flat();

    return await Promise.all(
      postByFollowees.map(async (post) => {
        const author = await context.db.get(post.authorId);

        if (!author) {
          return;
        }

        const generatePostImageUrl = post.image
          ? await context.storage.getUrl(post.image)
          : undefined;

        const generateUserImageUrl = author.imageStorageId
          ? await context.storage.getUrl(author.imageStorageId)
          : author.imageUrl;

        const authorIncludeImageUrl = {
          ...author,
          imageUrl: generateUserImageUrl!,
        };

        return {
          ...post,
          author: authorIncludeImageUrl,
          image: generatePostImageUrl!,
        };
      }),
    );
  },
});
