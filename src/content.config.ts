import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog posts — Markdown/MDX, one folder per post (src/content/blog/<slug>/index.md(x)).
// Schema-validated via Zod; queries are type-safe through getCollection().
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    author: z.enum(['johann']).optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    skills: z.array(z.object({
      slug: z.string(),
      desc: z.string(),
      install: z.string(),
      hidden: z.boolean().default(false),
      // Optional tech-architecture details shown via a chevron disclosure on /skills/.
      // `what` = one-line pitch; `how` = mechanism under the hood; `steps` = ordered process.
      details: z.object({
        what: z.string(),
        how: z.string().optional(),
        steps: z.array(z.string()).optional(),
      }).optional(),
    })).optional(),
  }),
});

export const collections = { blog };
