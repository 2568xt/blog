import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

import { postFrontmatterSchema } from "./content/schema";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/posts",
  }),
  schema: postFrontmatterSchema,
});

export const collections = { posts };
