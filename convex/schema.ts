import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name: v.string(),
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    posts: v.optional(v.array(v.id('posts'))),
    followers: v.optional(v.array(v.id('users'))),
    following: v.optional(v.array(v.id('users'))),
    updatedAt: v.optional(v.number()),
  })
    .index('by_email', ['email'])
    .index('by_clerkId', ['clerkId']),

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
    updatedAt: v.number(),
  })
    .index('by_author', ['author'])
    .index('by_published', ['published'])
    .index('by_tags', ['tags'])
    .index('by_comments', ['comments']),

  comments: defineTable({
    content: v.string(),
    author: v.id('users'),
    post: v.id('posts'),
    likes: v.array(v.id('users')),
    updatedAt: v.number(),
  })
    .index('by_post', ['post'])
    .index('by_author', ['author']),
});
