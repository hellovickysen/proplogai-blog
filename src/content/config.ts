import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('PropLogAI Team'),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
