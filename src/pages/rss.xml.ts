import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

import { siteConfig } from "../config/site";
import { getPublishedEntries } from "../lib/posts";
import { postPath } from "../lib/routing";

export async function GET(context: { site: string }) {
  const posts = getPublishedEntries(await getCollection("posts"));
  const feedSiteUrl = new URL(`${siteConfig.basePath}/`, context.site).toString();

  return rss({
    title: siteConfig.siteTitle,
    description: siteConfig.siteDescription,
    site: feedSiteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: postPath(post.id),
    })),
    customData: "<language>zh-cn</language>",
  });
}
