import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    silo: z.string(),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
    metaTitle: z.string().optional(),
    disclaimer: z.string().default('Educational content only. This article is not trading, investment, or financial advice.'),
  }),
});

export const collections = { blog };
