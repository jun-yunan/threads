import { ConvexError, v } from 'convex/values';
import { mutation } from './_generated/server';

export const create = mutation({
  args: {
    authorId: v.id('users'),
    postId: v.id('posts'),
    content: v.string(),
    tags: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    image: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    const { content, image, location, tags, postId, authorId } = args;

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const [author, post] = await Promise.all([
      ctx.db.get(authorId),
      ctx.db.get(postId),
    ]);

    if (!author || !post) {
      throw new ConvexError('Author or post not found');
    }

    const reply = await ctx.db.insert('replies', {
      authorId,
      postId,
      content,
      location,
      tags,
      image,
      updatedAt: Date.now(),
    });

    if (!reply) {
      throw new ConvexError('Failed to create post');
    }

    return reply;
  },
});
