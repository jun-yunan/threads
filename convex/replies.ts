import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc } from './_generated/dataModel';

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

export const getReplyByPostId = query({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('Unauthorized');
    }

    const replies = await ctx.db
      .query('replies')
      .withIndex('by_post_id', (q) => q.eq('postId', args.postId))
      .collect();

    const result = await Promise.all(
      replies.map(async (reply) => {
        const author = await ctx.db.get(reply.authorId);

        if (!author) {
          throw new ConvexError('Author not found');
        }

        const image = reply.image
          ? await ctx.storage.getUrl(reply.image)
          : undefined;

        const authorImage = author?.imageStorageId
          ? await ctx.storage.getUrl(author.imageStorageId)
          : author?.imageUrl;

        const authorIncludeImageUrl = {
          ...author,
          imageUrl: authorImage!,
        };

        return { ...reply, author: authorIncludeImageUrl, image };
      }),
    );

    return result;
  },
});
