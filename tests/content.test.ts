import { describe, expect, it } from "vitest";

import { postFrontmatterSchema } from "../src/content/schema";
import {
  collectTagSummaries,
  getPublishedPosts,
  type PostMeta,
} from "../src/lib/posts";
import { postPath, tagPath, withBase } from "../src/lib/routing";

describe("postFrontmatterSchema", () => {
  it("accepts the agreed frontmatter shape", () => {
    const result = postFrontmatterSchema.parse({
      title: "Astro on GitHub Pages",
      date: "2026-04-26",
      summary: "A short setup note.",
      tags: ["astro", "deploy"],
      draft: false,
    });

    expect(result.title).toBe("Astro on GitHub Pages");
    expect(result.tags).toEqual(["astro", "deploy"]);
  });

  it("rejects frontmatter without a summary", () => {
    expect(() =>
      postFrontmatterSchema.parse({
        title: "Missing summary",
        date: "2026-04-26",
        tags: ["invalid"],
      }),
    ).toThrow();
  });
});

describe("getPublishedPosts", () => {
  it("filters drafts and sorts posts by date descending", () => {
    const posts: PostMeta[] = [
      {
        slug: "older-note",
        title: "Older Note",
        date: "2026-04-20",
        summary: "Older",
        tags: ["astro"],
      },
      {
        slug: "draft-note",
        title: "Draft Note",
        date: "2026-04-30",
        summary: "Draft",
        tags: ["draft"],
        draft: true,
      },
      {
        slug: "newer-note",
        title: "Newer Note",
        date: "2026-04-24",
        summary: "Newer",
        tags: ["astro", "css"],
      },
    ];

    expect(getPublishedPosts(posts).map((post) => post.slug)).toEqual([
      "newer-note",
      "older-note",
    ]);
  });
});

describe("collectTagSummaries", () => {
  it("returns tags with counts sorted by usage then name", () => {
    const posts: PostMeta[] = [
      {
        slug: "one",
        title: "One",
        date: "2026-04-20",
        summary: "One",
        tags: ["astro", "css"],
      },
      {
        slug: "two",
        title: "Two",
        date: "2026-04-21",
        summary: "Two",
        tags: ["css", "notes"],
      },
      {
        slug: "draft-three",
        title: "Draft Three",
        date: "2026-04-22",
        summary: "Three",
        tags: ["draft-only"],
        draft: true,
      },
    ];

    expect(collectTagSummaries(posts)).toEqual([
      { tag: "css", count: 2 },
      { tag: "astro", count: 1 },
      { tag: "notes", count: 1 },
    ]);
  });
});

describe("routing helpers", () => {
  it("prefixes routes with the configured base path", () => {
    expect(withBase("/")).toBe("/blog/");
    expect(postPath("astro-notes")).toBe("/blog/posts/astro-notes/");
    expect(tagPath("deep learning")).toBe("/blog/tags/deep-learning/");
  });
});
