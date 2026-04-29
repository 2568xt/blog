# Quiet Product Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing Astro blog from the current light editorial design into a dark, writing-first `Quiet Product` design across all pages.

**Architecture:** Keep the current Astro routes, content collections, and shared component boundaries. Update rendered HTML class contracts first, then rewrite the shared global CSS around dark product tokens and verify the built pages through Vitest and browser review.

**Tech Stack:** Astro 6, TypeScript, Vitest, static HTML build output, global CSS

---

## File Map

- `src/layouts/BaseLayout.astro`
  Owns the document shell, global header, nav, main wrapper, and footer. It will switch from `editorial` naming to `quiet-product` naming.
- `src/pages/index.astro`
  Owns the homepage intro and latest-writing section. It will become the `Signal Stream` homepage.
- `src/components/PostList.astro`
  Owns shared post rows for homepage and single-tag pages. It will become the shared quiet product article stream.
- `src/components/TagPill.astro`
  Owns linked tag pills shown in article lists and post heroes.
- `src/components/TableOfContents.astro`
  Owns post page table of contents markup.
- `src/components/InlineNote.astro`
  Owns MDX note styling hooks.
- `src/pages/posts/[slug].astro`
  Owns post hero, reading layout, prose wrapper, TOC placement, and previous/next navigation.
- `src/pages/archives/index.astro`
  Owns the year-grouped archive index.
- `src/pages/tags/index.astro`
  Owns the tag index.
- `src/pages/tags/[tag].astro`
  Owns the single-tag article stream.
- `src/styles/global.css`
  Owns all visual tokens, typography, layout, post rows, prose, archive, tags, responsive behavior, and motion preferences.
- `tests/editorial-shell.test.ts`
  Will be rewritten to assert the quiet product shell contract.
- `tests/editorial-indexes.test.ts`
  Will be rewritten to assert the quiet product homepage, archive, tag index, and single-tag contracts.
- `tests/editorial-post-page.test.ts`
  Will be rewritten to assert the quiet product reading page contract.
- `tests/quiet-product-css.test.ts`
  Will be created to protect the dark token system and responsive/accessibility hooks.

## Task 1: Quiet Product Shell and Signal Stream Homepage

**Files:**
- Modify: `tests/editorial-shell.test.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write the failing shell regression test**

Replace `tests/editorial-shell.test.ts` with:

```ts
import { describe, expect, it } from "vitest";

import { readBuiltPage } from "./helpers/rendered-html";

describe("quiet product shell", () => {
  it("renders the homepage with quiet product shell and signal stream structure", () => {
    const html = readBuiltPage("index.html");

    expect(html).toContain('class="quiet-product-theme"');
    expect(html).toContain('class="site-header site-header--quiet-product"');
    expect(html).toContain('class="site-nav site-nav--quiet-product"');
    expect(html).toContain('class="site-main site-main--quiet-product"');
    expect(html).toContain('class="page-intro page-intro--signal-stream"');
    expect(html).toContain('class="home-meta"');
    expect(html).toContain('class="section-heading section-heading--stream"');
    expect(html).toContain('class="site-footer site-footer--quiet-product"');
    expect(html).toContain("关于视觉、模型与代码的简洁笔记。");
    expect(html).not.toContain("site-header--editorial");
    expect(html).not.toContain("page-intro--home");
  });
});
```

- [ ] **Step 2: Run the shell test to verify it fails**

Run:

```bash
npx vitest run tests/editorial-shell.test.ts
```

Expected: FAIL because the current build still renders `editorial` shell classes and does not render `quiet-product` classes.

- [ ] **Step 3: Update the global shell markup**

In `src/layouts/BaseLayout.astro`, replace the body, header, main, and footer class names with:

```astro
<body class="quiet-product-theme">
  <header class="site-header site-header--quiet-product">
    <div class="site-shell site-header__inner site-header__inner--quiet-product">
      <a class="site-brand site-brand--quiet-product" href={homePath()}>
        <span class="site-brand__name">{siteConfig.siteTitle}</span>
        <span class="site-brand__tagline">Writing system</span>
      </a>
      <nav class="site-nav site-nav--quiet-product" aria-label="主导航">
        {navigation.map((item) => (
          <a class="site-nav__link" href={item.href}>{item.label}</a>
        ))}
      </nav>
    </div>
  </header>
  <main class="site-main site-main--quiet-product">
    <div class="site-shell site-shell--quiet-product">
      <slot />
    </div>
  </main>
  <footer class="site-footer site-footer--quiet-product">
    <div class="site-shell site-footer__inner site-footer__inner--quiet-product">
      <p>{siteConfig.siteDescription}</p>
      <p>Published with Astro.</p>
    </div>
  </footer>
</body>
```

Keep the existing metadata, canonical URL, favicon, RSS link, and navigation array unchanged.

- [ ] **Step 4: Update the homepage intro into the signal stream shape**

In `src/pages/index.astro`, replace the current `<BaseLayout>` contents with:

```astro
<BaseLayout canonicalPath={homePath()}>
  <section class="page-intro page-intro--signal-stream">
    <p class="page-intro__eyebrow">Personal writing</p>
    <h1>{siteConfig.siteTitle}</h1>
    <p class="page-intro__lead">{siteConfig.siteDescription}</p>
    <div class="home-meta" aria-label="站点概览">
      <span>{posts.length} 篇已发布</span>
      <a href="/blog/archives/">归档</a>
      <a href="/blog/rss.xml">RSS</a>
    </div>
  </section>

  <section class="home-section home-section--stream">
    <div class="section-heading section-heading--stream">
      <div>
        <p class="section-heading__eyebrow">Latest writing</p>
        <h2>最新文章</h2>
      </div>
    </div>
    <PostList posts={posts} />
  </section>
</BaseLayout>
```

- [ ] **Step 5: Add minimal CSS aliases so the page builds before the full CSS rewrite**

In `src/styles/global.css`, add these selectors near the existing shell and homepage selectors:

```css
body.quiet-product-theme {
  margin: 0;
  min-width: 320px;
  background: var(--bg);
  color: var(--text);
  line-height: 1.8;
}

.site-header--quiet-product {
  backdrop-filter: blur(14px);
  background: rgba(12, 15, 21, 0.88);
  border-bottom: 1px solid var(--border);
}

.site-header__inner--quiet-product,
.site-footer__inner--quiet-product {
  align-items: center;
  justify-content: space-between;
}

.site-main--quiet-product {
  padding: 0 0 4.5rem;
}

.page-intro--signal-stream {
  padding: 4.75rem 0 1.5rem;
  margin-bottom: 1rem;
}

.home-meta {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  color: var(--text-muted);
  font-size: 0.92rem;
}

.section-heading--stream {
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
}
```

- [ ] **Step 6: Run the shell test to verify it passes**

Run:

```bash
npx vitest run tests/editorial-shell.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit Task 1**

Run:

```bash
git add tests/editorial-shell.test.ts src/layouts/BaseLayout.astro src/pages/index.astro src/styles/global.css
git commit -m "feat: add quiet product shell"
```

Expected: commit succeeds.

## Task 2: Shared Post Stream and Tag Pills

**Files:**
- Modify: `tests/editorial-indexes.test.ts`
- Modify: `src/components/PostList.astro`
- Modify: `src/components/TagPill.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write the failing shared post stream test**

Replace `tests/editorial-indexes.test.ts` with this first version:

```ts
import { describe, expect, it } from "vitest";

import { readBuiltPage } from "./helpers/rendered-html";

describe("quiet product indexes", () => {
  it("renders shared quiet product post streams on listing pages", () => {
    const home = readBuiltPage("index.html");
    const astroTag = readBuiltPage("tags/astro/index.html");

    for (const html of [home, astroTag]) {
      expect(html).toContain('class="post-list post-list--quiet-product"');
      expect(html).toContain('class="post-row post-row--quiet-product"');
      expect(html).toContain('class="post-row__article"');
      expect(html).toContain('class="post-row__date"');
      expect(html).toContain('class="post-row__body"');
      expect(html).toContain('class="tag-pill tag-pill--quiet-product"');
      expect(html).not.toContain('class="post-card"');
      expect(html).not.toContain("post-list--editorial");
    }
  });
});
```

- [ ] **Step 2: Run the index test to verify it fails**

Run:

```bash
npx vitest run tests/editorial-indexes.test.ts
```

Expected: FAIL because `PostList.astro` and `TagPill.astro` still render `--editorial` classes.

- [ ] **Step 3: Update shared post row markup**

Replace the list markup in `src/components/PostList.astro` with:

```astro
<ol class="post-list post-list--quiet-product">
  {
    posts.map((post) => (
      <li class="post-row post-row--quiet-product">
        <article class="post-row__article">
          <time class="post-row__date" datetime={post.data.date.toISOString()}>
            {formatDisplayDate(post.data.date)}
          </time>
          <div class="post-row__body">
            <h2 class="post-row__title">
              <a href={postPath(post.id)}>{post.data.title}</a>
            </h2>
            <p class="post-row__summary">{post.data.summary}</p>
            <div class="tag-list tag-list--quiet-product" aria-label="文章标签">
              {post.data.tags.map((tag) => <TagPill tag={tag} />)}
            </div>
          </div>
        </article>
      </li>
    ))
  }
</ol>
```

- [ ] **Step 4: Update tag pill markup**

Replace the anchor in `src/components/TagPill.astro` with:

```astro
<a class="tag-pill tag-pill--quiet-product" href={tagPath(tag)}>
  #{tag}
</a>
```

- [ ] **Step 5: Add post stream CSS aliases before the full CSS rewrite**

In `src/styles/global.css`, add:

```css
.post-list--quiet-product {
  border-top: 1px solid var(--border);
}

.post-row--quiet-product {
  padding: 1.2rem 0;
  border-bottom: 1px solid var(--border);
}

.tag-list--quiet-product {
  gap: 0.45rem;
  margin-top: 0.9rem;
}

.tag-pill--quiet-product {
  min-height: 2rem;
  gap: 0.35rem;
  padding: 0.18rem 0.55rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-soft);
  font-size: 0.82rem;
  background: rgba(255, 255, 255, 0.03);
}
```

- [ ] **Step 6: Run the index test to verify it passes**

Run:

```bash
npx vitest run tests/editorial-indexes.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit Task 2**

Run:

```bash
git add tests/editorial-indexes.test.ts src/components/PostList.astro src/components/TagPill.astro src/styles/global.css
git commit -m "feat: add quiet product post stream"
```

Expected: commit succeeds.

## Task 3: Archive and Tag Index Contracts

**Files:**
- Modify: `tests/editorial-indexes.test.ts`
- Modify: `src/pages/archives/index.astro`
- Modify: `src/pages/tags/index.astro`
- Modify: `src/pages/tags/[tag].astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Extend the index test for archive and tag pages**

Replace `tests/editorial-indexes.test.ts` with:

```ts
import { describe, expect, it } from "vitest";

import { readBuiltPage } from "./helpers/rendered-html";

describe("quiet product indexes", () => {
  it("renders shared quiet product post streams on listing pages", () => {
    const home = readBuiltPage("index.html");
    const astroTag = readBuiltPage("tags/astro/index.html");

    for (const html of [home, astroTag]) {
      expect(html).toContain('class="post-list post-list--quiet-product"');
      expect(html).toContain('class="post-row post-row--quiet-product"');
      expect(html).toContain('class="post-row__article"');
      expect(html).toContain('class="post-row__date"');
      expect(html).toContain('class="tag-pill tag-pill--quiet-product"');
      expect(html).not.toContain('class="post-card"');
      expect(html).not.toContain("post-list--editorial");
    }
  });

  it("renders archive and tag indexes with quiet product classes", () => {
    const archive = readBuiltPage("archives/index.html");
    const tags = readBuiltPage("tags/index.html");
    const astroTag = readBuiltPage("tags/astro/index.html");

    expect(archive).toContain('class="archive-page archive-page--quiet-product"');
    expect(archive).toContain('class="archive-list archive-list--quiet-product"');
    expect(archive).toContain('class="archive-list__item archive-list__item--quiet-product"');
    expect(archive).not.toContain("archive-page--editorial");

    expect(tags).toContain('class="tags-page tags-page--quiet-product"');
    expect(tags).toContain('class="tags-grid tags-grid--quiet-product"');
    expect(tags).toContain('class="tag-pill tag-pill--quiet-product tag-pill--count"');
    expect(tags).not.toContain("tags-page--editorial");

    expect(astroTag).toContain('class="tag-page tag-page--quiet-product"');
    expect(astroTag).toContain('class="post-list post-list--quiet-product"');
  });
});
```

- [ ] **Step 2: Run the index test to verify it fails on archive and tag classes**

Run:

```bash
npx vitest run tests/editorial-indexes.test.ts
```

Expected: FAIL because archive and tag pages still render `--editorial` class names.

- [ ] **Step 3: Update archive page classes**

In `src/pages/archives/index.astro`, update the outer and list classes:

```astro
<section class="archive-page archive-page--quiet-product">
  <div class="section-heading section-heading--index">
    <div>
      <p class="section-heading__eyebrow">Archive</p>
      <h1 class="tag-page__heading">归档</h1>
    </div>
    <span>{publishedPosts.length} 篇公开文章</span>
  </div>

  <div class="archive-groups">
    {
      groupedPosts.map((group) => (
        <section class="archive-group">
          <div class="section-heading section-heading--index">
            <h2>{group.year}</h2>
            <span class="archive-group__count">{group.entries.length} 篇</span>
          </div>
          <ul class="archive-list archive-list--quiet-product">
            {group.entries.map((post) => (
              <li class="archive-list__item archive-list__item--quiet-product">
                <time class="archive-list__date" datetime={post.data.date.toISOString()}>
                  {formatDisplayDate(post.data.date)}
                </time>
                <a class="archive-link" href={postPath(post.id)}>
                  {post.data.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))
    }
  </div>
</section>
```

- [ ] **Step 4: Update tag index and single tag page classes**

In `src/pages/tags/index.astro`, use:

```astro
<section class="tags-page tags-page--quiet-product">
  <div class="section-heading section-heading--index">
    <div>
      <p class="section-heading__eyebrow">Topics</p>
      <h1 class="tags-page__heading">标签</h1>
    </div>
    <span>{tagSummaries.length} 个主题</span>
  </div>

  {
    tagSummaries.length > 0 ? (
      <div class="tags-grid tags-grid--quiet-product">
        {tagSummaries.map((summary) => (
          <a class="tag-pill tag-pill--quiet-product tag-pill--count" href={tagPath(summary.tag)}>
            <span>#{summary.tag}</span>
            <span class="tag-pill__count">{summary.count}</span>
          </a>
        ))}
      </div>
    ) : (
      <p class="empty-state">还没有公开标签。</p>
    )
  }
</section>
```

In `src/pages/tags/[tag].astro`, use:

```astro
<section class="tag-page tag-page--quiet-product">
  <div class="section-heading section-heading--index">
    <div>
      <p class="section-heading__eyebrow">Topic archive</p>
      <h1 class="tag-page__heading">#{tag}</h1>
    </div>
    <span class="tag-meta">{posts.length} 篇文章</span>
  </div>
  <PostList posts={posts} />
</section>
```

- [ ] **Step 5: Add archive and tag CSS aliases**

In `src/styles/global.css`, add:

```css
.archive-page--quiet-product,
.tags-page--quiet-product,
.tag-page--quiet-product {
  padding: 4rem 0 0;
}

.archive-list--quiet-product {
  border-top: 1px solid var(--border);
}

.archive-list__item--quiet-product {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  gap: 1.25rem;
  padding: 0.95rem 0;
  border-bottom: 1px solid var(--border);
}

.tags-grid--quiet-product {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
}
```

- [ ] **Step 6: Run the index test to verify it passes**

Run:

```bash
npx vitest run tests/editorial-indexes.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit Task 3**

Run:

```bash
git add tests/editorial-indexes.test.ts src/pages/archives/index.astro src/pages/tags/index.astro src/pages/tags/[tag].astro src/styles/global.css
git commit -m "feat: add quiet product indexes"
```

Expected: commit succeeds.

## Task 4: Reading-First Post Page

**Files:**
- Modify: `tests/editorial-post-page.test.ts`
- Modify: `src/pages/posts/[slug].astro`
- Modify: `src/components/TableOfContents.astro`
- Modify: `src/components/InlineNote.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write the failing post page regression test**

Replace `tests/editorial-post-page.test.ts` with:

```ts
import { describe, expect, it } from "vitest";

import { readBuiltPage } from "./helpers/rendered-html";

describe("quiet product post page", () => {
  it("renders a reading-first post page with quiet product support surfaces", () => {
    const html = readBuiltPage("posts/from-empty-repo-to-pages/index.html");

    expect(html).toContain('class="post-page post-page--quiet-product"');
    expect(html).toContain('class="post-hero post-hero--reading-first"');
    expect(html).toContain('class="post-layout post-layout--reading-first"');
    expect(html).toContain('class="prose prose--quiet-product"');
    expect(html).toContain('class="toc toc--quiet-product"');
    expect(html).toContain('class="article-pagination article-pagination--quiet-product"');
    expect(html).toContain('class="post-hero__tags post-hero__tags--quiet-product"');
    expect(html).not.toContain("post-page--editorial");
    expect(html).not.toContain("prose--editorial");
    expect(html).not.toContain('class="pager-card"');
  });
});
```

- [ ] **Step 2: Run the post page test to verify it fails**

Run:

```bash
npx vitest run tests/editorial-post-page.test.ts
```

Expected: FAIL because the post page still renders `--editorial` class names.

- [ ] **Step 3: Update post page markup**

In `src/pages/posts/[slug].astro`, update the rendered body to:

```astro
<article class="post-page post-page--quiet-product">
  <header class="post-hero post-hero--reading-first">
    <p class="post-hero__eyebrow">Essay</p>
    <div class="post-hero__meta">
      <time datetime={post.data.date.toISOString()}>
        {formatDisplayDate(post.data.date)}
      </time>
      <span>#{post.id}</span>
    </div>
    <h1>{post.data.title}</h1>
    <p class="post-hero__summary">{post.data.summary}</p>
    <div class="post-hero__tags post-hero__tags--quiet-product" aria-label="文章标签">
      {post.data.tags.map((tag) => <TagPill tag={tag} />)}
    </div>
  </header>

  <div class="post-layout post-layout--reading-first">
    <div class="post-content">
      <div class="prose prose--quiet-product">
        <Content />
      </div>

      <footer class="post-footer post-footer--quiet-product">
        <p class="post-footer__caption">继续阅读</p>
        <nav class="article-pagination article-pagination--quiet-product" aria-label="相邻文章">
          <div class="article-pagination__item">
            <span class="article-pagination__label">较新</span>
            {
              newer ? (
                <a class="article-pagination__link" href={postPath(newer.id)}>
                  {newer.data.title}
                </a>
              ) : (
                <span class="article-pagination__empty">已经是最新一篇</span>
              )
            }
          </div>
          <div class="article-pagination__item">
            <span class="article-pagination__label">较早</span>
            {
              older ? (
                <a class="article-pagination__link" href={postPath(older.id)}>
                  {older.data.title}
                </a>
              ) : (
                <span class="article-pagination__empty">已经是最早一篇</span>
              )
            }
          </div>
        </nav>
      </footer>
    </div>

    <div class="post-sidebar post-sidebar--quiet-product">
      <TableOfContents headings={headings} />
    </div>
  </div>
</article>
```

- [ ] **Step 4: Update table of contents and inline note classes**

In `src/components/TableOfContents.astro`, update the aside class:

```astro
<aside class="toc toc--quiet-product" aria-labelledby="toc-title">
  <p class="toc__eyebrow">Contents</p>
  <p class="toc__title" id="toc-title">
    目录
  </p>
  <ol class="toc__list">
    {visibleHeadings.map((heading) => (
      <li class={`toc__item toc__item--depth-${heading.depth}`}>
        <a href={`#${heading.slug}`}>{heading.text}</a>
      </li>
    ))}
  </ol>
</aside>
```

In `src/components/InlineNote.astro`, update the aside class:

```astro
<aside class="inline-note inline-note--quiet-product">
  <p class="inline-note__title">{title}</p>
  <div class="inline-note__body">
    <slot />
  </div>
</aside>
```

- [ ] **Step 5: Add post page CSS aliases**

In `src/styles/global.css`, add:

```css
.post-page--quiet-product {
  padding: 4.5rem 0 0;
}

.post-hero--reading-first {
  max-width: 50rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.post-hero__tags--quiet-product {
  gap: 0.45rem;
  margin-top: 1.1rem;
}

.post-layout--reading-first {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 15rem;
  gap: 4rem;
  padding-top: 2.4rem;
}

.post-sidebar--quiet-product {
  position: sticky;
  top: 6rem;
  align-self: start;
}

.toc--quiet-product {
  padding-left: 1rem;
  border-left: 1px solid var(--border);
}

.prose--quiet-product {
  max-width: 44rem;
  color: var(--text);
  font-size: 1.05rem;
}

.post-footer--quiet-product {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.article-pagination--quiet-product {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.inline-note--quiet-product {
  background: rgba(240, 169, 74, 0.08);
}
```

- [ ] **Step 6: Run the post page test to verify it passes**

Run:

```bash
npx vitest run tests/editorial-post-page.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit Task 4**

Run:

```bash
git add tests/editorial-post-page.test.ts src/pages/posts/[slug].astro src/components/TableOfContents.astro src/components/InlineNote.astro src/styles/global.css
git commit -m "feat: add quiet product post page"
```

Expected: commit succeeds.

## Task 5: Full Dark Product CSS System

**Files:**
- Create: `tests/quiet-product-css.test.ts`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write the failing CSS token and responsive test**

Create `tests/quiet-product-css.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const cssPath = resolve(import.meta.dirname, "..", "src", "styles", "global.css");

describe("quiet product CSS system", () => {
  it("defines the dark product token system and responsive hooks", () => {
    const css = readFileSync(cssPath, "utf8");

    expect(css).toContain("color-scheme: dark;");
    expect(css).toContain("--bg: #0c0f15;");
    expect(css).toContain("--surface: #151a23;");
    expect(css).toContain("--text: #f4f1ea;");
    expect(css).toContain("--accent: #f0a94a;");
    expect(css).toContain("body.quiet-product-theme");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("@media (max-width: 760px)");
    expect(css).not.toContain("--bg: #f3ede4");
    expect(css).not.toContain("Iowan Old Style");
  });
});
```

- [ ] **Step 2: Run the CSS test to verify it fails**

Run:

```bash
npx vitest run tests/quiet-product-css.test.ts
```

Expected: FAIL because `global.css` still contains light editorial tokens and the serif display stack.

- [ ] **Step 3: Replace the design tokens and base document styles**

In `src/styles/global.css`, replace the current `:root`, body, typography, and base link styles with:

```css
:root {
  color-scheme: dark;
  --bg: #0c0f15;
  --bg-soft: #10141c;
  --surface: #151a23;
  --surface-soft: #1b212c;
  --surface-warm: rgba(240, 169, 74, 0.08);
  --border: rgba(169, 176, 188, 0.16);
  --border-strong: rgba(240, 169, 74, 0.34);
  --text: #f4f1ea;
  --text-soft: #c6cbd3;
  --text-muted: #7d8694;
  --accent: #f0a94a;
  --accent-strong: #ffd08a;
  --code-bg: #101722;
  --focus-ring: rgba(240, 169, 74, 0.42);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  background: var(--bg);
}

body.quiet-product-theme {
  margin: 0;
  min-width: 320px;
  font-family:
    "SF Pro Text",
    "SF Pro Display",
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    system-ui,
    sans-serif;
  background:
    radial-gradient(circle at 85% -10%, rgba(240, 169, 74, 0.12), transparent 32rem),
    linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 22rem),
    var(--bg);
  color: var(--text);
  line-height: 1.72;
  text-rendering: optimizeLegibility;
}

a {
  color: inherit;
  text-decoration: none;
}

a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 3px;
}

img {
  max-width: 100%;
  display: block;
}

code,
pre {
  font-family:
    "SFMono-Regular",
    ui-monospace,
    "Cascadia Code",
    "JetBrains Mono",
    monospace;
}

::selection {
  background: rgba(240, 169, 74, 0.24);
}
```

- [ ] **Step 4: Replace shell, header, homepage, and shared list CSS**

Update the shell, header, homepage, post-row, tag, archive, and footer selectors so the active class names use the quiet product system:

```css
.site-shell {
  width: min(100% - 2rem, 72rem);
  margin: 0 auto;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
}

.site-header--quiet-product {
  backdrop-filter: blur(18px);
  background: rgba(12, 15, 21, 0.84);
  border-bottom: 1px solid var(--border);
}

.site-header__inner {
  display: flex;
}

.site-header__inner--quiet-product {
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 0.9rem 0;
}

.site-brand {
  display: inline-flex;
  flex-direction: column;
}

.site-brand--quiet-product {
  gap: 0.12rem;
}

.site-brand__name {
  font-size: 0.98rem;
  font-weight: 650;
  letter-spacing: 0;
}

.site-brand__tagline {
  color: var(--text-muted);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.site-nav__link,
.site-nav a {
  min-height: 2rem;
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--text-soft);
  font-size: 0.9rem;
  transition:
    color 180ms ease,
    border-color 180ms ease,
    background 180ms ease;
}

.site-nav a:hover,
.site-nav a:focus-visible {
  color: var(--text);
  border-color: var(--border);
  background: rgba(255, 255, 255, 0.04);
}

.site-main--quiet-product {
  padding: 0 0 4.5rem;
}

.site-footer {
  border-top: 1px solid var(--border);
}

.site-footer__inner--quiet-product {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1.5rem 0 2.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.page-intro {
  border-bottom: 1px solid var(--border);
}

.page-intro--signal-stream {
  padding: 4.75rem 0 1.5rem;
  margin-bottom: 1rem;
}

.page-intro__eyebrow,
.section-heading__eyebrow,
.post-hero__eyebrow,
.toc__eyebrow,
.inline-note__title {
  margin: 0 0 0.75rem;
  color: var(--accent);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.page-intro--signal-stream h1,
.post-hero--reading-first h1,
.not-found h1 {
  margin: 0;
  max-width: 52rem;
  font-size: clamp(2.6rem, 6vw, 4.8rem);
  line-height: 0.98;
  letter-spacing: 0;
}

.page-intro__lead,
.post-hero__summary,
.not-found p {
  max-width: 37rem;
  margin: 1rem 0 0;
  color: var(--text-soft);
  font-size: 1.08rem;
}

.home-meta {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
  margin-top: 1.15rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.home-meta span,
.home-meta a {
  min-height: 1.9rem;
  display: inline-flex;
  align-items: center;
  padding: 0.18rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
}

.home-meta a:hover,
.home-meta a:focus-visible {
  color: var(--accent-strong);
  border-color: var(--border-strong);
}

.section-heading--stream,
.section-heading--index {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
}

.section-heading--stream h2,
.archive-group h2,
.tag-page__heading,
.tags-page__heading {
  margin: 0;
  font-size: 1.28rem;
  letter-spacing: 0;
}
```

- [ ] **Step 5: Replace article stream, archive, tag, and prose CSS**

Ensure these quiet product selectors are present and no active selector depends on `--editorial`:

```css
.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-list--quiet-product,
.archive-list--quiet-product {
  border-top: 1px solid var(--border);
}

.post-row--quiet-product {
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--border);
  transition:
    border-color 180ms ease,
    background 180ms ease;
}

.post-row--quiet-product:hover {
  border-color: rgba(240, 169, 74, 0.26);
  background: linear-gradient(90deg, rgba(240, 169, 74, 0.045), transparent 70%);
}

.post-row__article,
.archive-list__item--quiet-product {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
}

.post-row__date,
.archive-list__date {
  color: var(--text-muted);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.post-row__body {
  min-width: 0;
}

.post-row__title {
  margin: 0;
  font-size: 1.6rem;
  line-height: 1.14;
  letter-spacing: 0;
}

.post-row__title a:hover,
.post-row__title a:focus-visible,
.archive-link:hover,
.archive-link:focus-visible {
  color: var(--accent-strong);
}

.post-row__summary {
  margin: 0.55rem 0 0;
  color: var(--text-soft);
}

.tag-list,
.post-hero__tags,
.tags-grid {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
}

.tag-list--quiet-product {
  gap: 0.45rem;
  margin-top: 0.9rem;
}

.tag-pill--quiet-product {
  min-height: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.18rem 0.55rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-soft);
  font-size: 0.82rem;
  background: rgba(255, 255, 255, 0.035);
  transition:
    color 180ms ease,
    border-color 180ms ease,
    background 180ms ease;
}

.tag-pill--quiet-product:hover,
.tag-pill--quiet-product:focus-visible {
  color: var(--accent-strong);
  border-color: var(--border-strong);
  background: rgba(240, 169, 74, 0.08);
}

.post-page--quiet-product,
.archive-page--quiet-product,
.tags-page--quiet-product,
.tag-page--quiet-product {
  padding: 4.25rem 0 0;
}

.post-hero--reading-first {
  max-width: 50rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.post-hero__meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  color: var(--text-muted);
  font-size: 0.92rem;
}

.post-layout--reading-first {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 15rem;
  gap: 4rem;
  padding-top: 2.4rem;
}

.post-sidebar--quiet-product {
  position: sticky;
  top: 6rem;
  align-self: start;
}

.toc--quiet-product {
  padding-left: 1rem;
  border-left: 1px solid var(--border);
}

.prose--quiet-product {
  max-width: 44rem;
  color: var(--text);
  font-size: 1.05rem;
}

.prose--quiet-product h2,
.prose--quiet-product h3,
.prose--quiet-product h4 {
  margin: 2.3rem 0 0.9rem;
  line-height: 1.2;
  scroll-margin-top: 5.5rem;
  letter-spacing: 0;
}

.prose--quiet-product p,
.prose--quiet-product ul,
.prose--quiet-product ol,
.prose--quiet-product blockquote {
  margin: 1rem 0;
  color: var(--text-soft);
}

.prose--quiet-product a {
  color: var(--accent-strong);
}

.prose--quiet-product blockquote {
  padding: 0.95rem 1rem;
  border-left: 2px solid var(--accent);
  background: var(--surface-warm);
  border-radius: 0 10px 10px 0;
}

.prose--quiet-product :not(pre) > code {
  padding: 0.12rem 0.35rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
  font-size: 0.9em;
}

.prose--quiet-product pre {
  margin: 1.25rem 0;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--code-bg) !important;
  overflow-x: auto;
}

.post-footer--quiet-product {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.article-pagination--quiet-product {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}
```

- [ ] **Step 6: Add responsive and reduced-motion rules**

Ensure `src/styles/global.css` contains:

```css
@media (max-width: 900px) {
  .post-layout--reading-first {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .post-sidebar--quiet-product {
    position: static;
  }

  .toc--quiet-product {
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.025);
  }
}

@media (max-width: 760px) {
  .site-shell {
    width: min(100% - 1.25rem, 72rem);
  }

  .site-header__inner--quiet-product,
  .site-footer__inner--quiet-product,
  .section-heading--stream,
  .section-heading--index {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-intro--signal-stream,
  .post-page--quiet-product,
  .archive-page--quiet-product,
  .tags-page--quiet-product,
  .tag-page--quiet-product {
    padding-top: 3rem;
  }

  .post-row__article,
  .archive-list__item--quiet-product {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .post-row__title {
    font-size: 1.34rem;
  }

  .article-pagination--quiet-product {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [ ] **Step 7: Run the CSS test to verify it passes**

Run:

```bash
npx vitest run tests/quiet-product-css.test.ts
```

Expected: PASS.

- [ ] **Step 8: Run all regression tests**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 9: Commit Task 5**

Run:

```bash
git add tests/quiet-product-css.test.ts src/styles/global.css
git commit -m "feat: apply quiet product visual system"
```

Expected: commit succeeds.

## Task 6: Final Build, Type Check, and Visual Review

**Files:**
- No planned source changes. If visual review finds a concrete issue, fix the smallest relevant source file and rerun the checks in this task.

- [ ] **Step 1: Run the full test suite**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 2: Run Astro type checking**

Run:

```bash
npm run check
```

Expected: PASS.

- [ ] **Step 3: Run the production build**

Run:

```bash
npm run build
```

Expected: PASS and `dist/` contains built pages for homepage, posts, archives, and tags.

- [ ] **Step 4: Start the local dev server for browser review**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Astro prints a local URL such as `http://127.0.0.1:4321/blog/`.

- [ ] **Step 5: Review the required pages in a browser**

Open these paths from the dev server:

```text
/blog/
/blog/posts/from-empty-repo-to-pages/
/blog/archives/
/blog/tags/
/blog/tags/astro/
```

Verify:

- Homepage shows article rows in the first viewport.
- Header nav wraps without overlap at mobile width.
- Post page reads as a single dominant reading column.
- TOC is secondary and does not squeeze the article.
- Code blocks scroll horizontally when narrow.
- Tags and metadata wrap cleanly.
- Palette reads as dark product UI with a warm signal accent.

- [ ] **Step 6: Commit visual fixes if any were needed**

If Step 5 required source changes, run:

```bash
git add src tests
git commit -m "fix: polish quiet product responsive layout"
```

Expected: commit succeeds only when Step 5 produced source changes. If Step 5 required no source changes, do not create an empty commit.

## Self-Review

Spec coverage:

- Global shell, header, footer: Task 1 and Task 5.
- Homepage Signal Stream: Task 1, Task 2, and Task 5.
- Shared post list: Task 2 and Task 5.
- Archive and tag pages: Task 3 and Task 5.
- Reading-first post page: Task 4 and Task 5.
- Dark product design system: Task 5.
- Responsive and reduced-motion behavior: Task 5 and Task 6.
- Verification: Task 6.

Plan consistency:

- The new class namespace is `quiet-product`.
- The homepage-specific intro modifier is `page-intro--signal-stream`.
- The post page layout modifier is `post-layout--reading-first`.
- Existing test file names are reused to avoid unnecessary file churn, with one new CSS contract test added.
- Every task has a failing-test step, implementation step, passing-test step, and commit step except the final verification task, which commits only if review produces source changes.
