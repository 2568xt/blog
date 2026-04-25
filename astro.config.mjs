// @ts-check
import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import { siteConfig } from "./site.config.mjs";

// https://astro.build/config
export default defineConfig({
  site: siteConfig.siteUrl,
  base: siteConfig.basePath,
  trailingSlash: "always",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
      wrap: true,
    },
  },
});
