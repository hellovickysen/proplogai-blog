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

    // Editorial and SEO metadata
    seoTitle: z.string().optional(),
    metaTitle: z.string().optional(),
    primaryKeyword: z.string().optional(),
    secondaryKeywords: z.array(z.string()).default([]),
    searchIntent: z.string().optional(),
    funnelStage: z.enum(['TOFU', 'MOFU', 'BOFU']).optional(),
    pillarPage: z.string().optional(),
    internalLinks: z.array(z.string()).default([]),
    externalCitations: z.array(z.string()).default([]),
    cta: z.string().optional(),
    disclaimer: z.string().default('Educational content only. This article is not trading, investment, or financial advice.'),
  }),
});

export const collections = { blog };
