import { z } from 'zod';

export const schemaUpdateProfile = z.object({
  username: z.string().min(3).max(20).optional(),
  name: z.string().min(3).max(50).optional(),
  bio: z.string().max(200).optional(),
  link: z.string().url().optional(),
});
