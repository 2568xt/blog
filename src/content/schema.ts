import { z } from "astro/zod";

export const postFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  draft: z.boolean().default(false),
  cover: z.string().optional(),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;
