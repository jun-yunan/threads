import { internal } from './_generated/api';
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from './_generated/server';
import { ConvexError, v } from 'convex/values';

export const create = internalMutation({
  args: {
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    updatedAt: v.number(),
  },
  handler: async (context, args) => {
    await context.db.insert('users', args);
  },
});

export const get = internalQuery({
  args: {
    clerkId: v.string(),
  },
  handler: async (context, args) => {
    return await context.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .unique();
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const user = await context.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new ConvexError('User not found');
    }

    return user;
  },
});

export const getUserByUsername = query({
  args: {
    username: v.string(),
  },
  handler: async (context, args) => {
    const { username } = args;

    if (!username) {
      throw new ConvexError('Username is required');
    }

    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const user = await context.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', username))
      .unique();

    if (!user) {
      throw new ConvexError('User not found');
    }

    const generateImageUrl = user.imageStorageId
      ? await context.storage.getUrl(user.imageStorageId)
      : user.imageUrl;

    return { ...user, imageUrl: generateImageUrl };

    // return user;
  },
});

export const update = mutation({
  args: {
    userId: v.id('users'),
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    link: v.optional(v.string()),
    imageStorageId: v.optional(v.id('_storage')),
    username: v.optional(v.string()),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const user = await context.db.get(args.userId);

    if (!user) {
      throw new ConvexError('User not found');
    }

    if (user.clerkId !== identity.subject) {
      throw new ConvexError('Unauthorized');
    }

    await context.db.patch(args.userId, args);
  },
});
