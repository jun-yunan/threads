import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name: v.string(),
    username: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.optional(v.id('_storage')),
    clerkId: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    link: v.optional(v.string()),
    posts: v.optional(v.array(v.id('posts'))),
    followers: v.optional(v.array(v.id('users'))),
    following: v.optional(v.array(v.id('users'))),
    updatedAt: v.optional(v.number()),
  })
    .index('by_email', ['email'])
    .index('by_clerkId', ['clerkId'])
    .index('by_username', ['username']),

  posts: defineTable({
    content: v.string(),
    author: v.id('users'),
    storageId: v.optional(v.id('_storage')),
    formatFile: v.optional(v.string()),
    comments: v.optional(v.array(v.id('comments'))),
    likes: v.optional(v.array(v.id('users'))),
    location: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    published: v.boolean(),
    originalThreadId: v.optional(v.id('posts')),
    isReply: v.optional(v.boolean()),
    updatedAt: v.number(),
  })
    .index('by_author', ['author'])
    .index('by_published', ['published'])
    .index('by_tags', ['tags'])
    .index('by_comments', ['comments'])
    .index('by_is_reply', ['isReply']),
  reposts: defineTable({
    postId: v.id('posts'),
    userId: v.id('users'),
    updatedAt: v.optional(v.number()),
  })
    .index('by_user_id', ['userId'])
    .index('by_post_id', ['postId'])
    .index('by_post_id_user_id', ['postId', 'userId']),

  replies: defineTable({
    authorId: v.id('users'),
    postId: v.id('posts'),
    content: v.string(),
    image: v.optional(v.id('_storage')),
    location: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    parentReplyId: v.optional(v.id('replies')),
    updatedAt: v.optional(v.number()),
  })
    .index('by_post_id', ['postId'])
    .index('by_parent_reply_id', ['parentReplyId'])
    .index('by_author_id', ['authorId']),

  followers: defineTable({
    follower: v.id('users'), // ID của người theo dõi
    following: v.id('users'), // ID của người được theo dõi
    updatedAt: v.optional(v.number()),
  })
    .index('by_follower', ['follower']) // Index theo người theo dõi
    .index('by_following', ['following']), // Index theo người được theo dõi

  comments: defineTable({
    content: v.string(),
    likes: v.array(v.id('users')),
    reply: v.optional(v.id('comments')),
    image: v.optional(v.id('_storage')),
    userId: v.id('users'),
    postId: v.id('posts'),
    updatedAt: v.optional(v.number()),
  })
    .index('by_post_id', ['postId'])
    .index('by_user_id', ['userId']),

  likes: defineTable({
    postId: v.id('posts'),
    userId: v.id('users'),
  })
    .index('by_post_id', ['postId'])
    .index('by_user_id', ['userId'])
    .index('by_post_id_user_id', ['postId', 'userId']),
});
