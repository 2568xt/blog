import type { CollectionEntry } from "astro:content";

export interface PostMeta {
  slug: string;
  title: string;
  date: string | Date;
  summary: string;
  tags: string[];
  draft?: boolean;
  cover?: string;
}

function toDateValue(date: string | Date): number {
  return new Date(date).getTime();
}

export function getPublishedPosts<T extends PostMeta>(posts: T[]): T[] {
  return posts
    .filter((post) => !post.draft)
    .sort((left, right) => toDateValue(right.date) - toDateValue(left.date));
}

export function collectTagSummaries(posts: PostMeta[]) {
  const counts = new Map<string, number>();

  for (const post of getPublishedPosts(posts)) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.tag.localeCompare(right.tag);
    });
}

export type PostEntry = CollectionEntry<"posts">;

export function toPostMeta(post: PostEntry): PostMeta {
  return {
    slug: post.id,
    title: post.data.title,
    date: post.data.date,
    summary: post.data.summary,
    tags: post.data.tags,
    draft: post.data.draft,
    cover: post.data.cover,
  };
}

export function getPublishedEntries(posts: PostEntry[]): PostEntry[] {
  return [...posts]
    .filter((post) => !post.data.draft)
    .sort(
      (left, right) =>
        toDateValue(right.data.date) - toDateValue(left.data.date),
    );
}

export function collectEntryTagSummaries(posts: PostEntry[]) {
  return collectTagSummaries(posts.map((post) => toPostMeta(post)));
}

export function getPostsForTag(posts: PostEntry[], tag: string): PostEntry[] {
  return getPublishedEntries(posts).filter((post) => post.data.tags.includes(tag));
}

export function getAdjacentEntries(posts: PostEntry[], currentId: string) {
  const publishedPosts = getPublishedEntries(posts);
  const index = publishedPosts.findIndex((post) => post.id === currentId);

  return {
    newer: index > 0 ? publishedPosts[index - 1] : undefined,
    older:
      index >= 0 && index < publishedPosts.length - 1
        ? publishedPosts[index + 1]
        : undefined,
  };
}

export function groupEntriesByYear(posts: PostEntry[]) {
  const grouped = new Map<string, PostEntry[]>();

  for (const post of getPublishedEntries(posts)) {
    const year = String(new Date(post.data.date).getFullYear());
    const currentPosts = grouped.get(year) ?? [];
    currentPosts.push(post);
    grouped.set(year, currentPosts);
  }

  return [...grouped.entries()].map(([year, entries]) => ({
    year,
    entries,
  }));
}

export function formatDisplayDate(date: Date | string): string {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
