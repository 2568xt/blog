# Anthropic Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Astro blog into a warm, Anthropic-inspired editorial site while keeping the existing routes and content model unchanged.

**Architecture:** Keep the current Astro content and routing pipeline, then concentrate the redesign in shared layout markup, list/article templates, and a single global stylesheet. Add build-based regression tests that inspect rendered HTML so the editorial structure stays intact across homepage, index pages, and article pages while the CSS is rewritten.

**Tech Stack:** Astro 6, TypeScript, Vitest, static HTML build output, global CSS

---

## File Map

- `tests/helpers/rendered-html.ts`
  Shared helper that runs `npm run build` once and reads HTML from `dist/` for regression tests.
- `tests/editorial-shell.test.ts`
  Verifies the homepage shell, header/footer, and intro structure render with the new editorial classes.
- `tests/editorial-indexes.test.ts`
  Verifies homepage post rows, archive index, tags index, and tag detail pages render editorial list markup instead of card markup.
- `tests/editorial-post-page.test.ts`
  Verifies article pages render the editorial hero, prose wrapper, TOC, and text-led pagination.
- `src/layouts/BaseLayout.astro`
  Global document shell, header, nav, main wrapper, and footer.
- `src/pages/index.astro`
  Homepage intro and section-heading structure.
- `src/components/PostList.astro`
  Shared post-row markup used on homepage and tag pages.
- `src/components/TagPill.astro`
  Shared quiet metadata pill markup.
- `src/pages/archives/index.astro`
  Archive index headings and row structure.
- `src/pages/tags/index.astro`
  Tag summary grid structure.
- `src/pages/tags/[tag].astro`
  Tag detail page heading wrapper around the shared post list.
- `src/pages/posts/[slug].astro`
  Editorial article hero, content layout, and previous/next navigation.
- `src/components/TableOfContents.astro`
  Quiet TOC markup that supports the article layout.
- `src/styles/global.css`
  Color tokens, typography, spacing, list styling, article styling, and responsive rules for the redesign.

### Task 1: Rebuild the Global Shell and Homepage Intro

**Files:**
- Create: `tests/helpers/rendered-html.ts`
- Create: `tests/editorial-shell.test.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write the failing build-based regression helper and homepage shell test**

```ts
// tests/helpers/rendered-html.ts
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const repoRoot = resolve(import.meta.dirname, "..", "..");
const distRoot = resolve(repoRoot, "dist");

let built = false;

export function ensureBuild() {
  if (built) {
    return;
  }

  execSync("npm run build", {
    cwd: repoRoot,
    stdio: "pipe",
  });

  built = true;
}

export function readBuiltPage(relativePath: string) {
  ensureBuild();

  const fullPath = resolve(distRoot, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Built page not found: ${relativePath}`);
  }

  return readFileSync(fullPath, "utf8");
}
```

```ts
// tests/editorial-shell.test.ts
import { describe, expect, it } from "vitest";

import { readBuiltPage } from "./helpers/rendered-html";

describe("editorial shell", () => {
  it("renders the homepage with editorial shell classes", () => {
    const html = readBuiltPage("index.html");

    expect(html).toContain('class="site-header site-header--editorial"');
    expect(html).toContain('class="site-nav site-nav--editorial"');
    expect(html).toContain('class="site-main site-main--editorial"');
    expect(html).toContain('class="page-intro page-intro--home"');
    expect(html).toContain('class="section-heading section-heading--home"');
    expect(html).toContain('class="site-footer site-footer--editorial"');
    expect(html).toContain("关于视觉、模型与代码的简洁笔记。");
  });
});
```

- [ ] **Step 2: Run the homepage shell test to verify it fails**

Run:

```bash
npx vitest run tests/editorial-shell.test.ts
```

Expected: FAIL because the rendered homepage still uses the current dark-theme shell and does not contain the new `--editorial` modifier classes.

- [ ] **Step 3: Implement the editorial shell and homepage intro**

```astro
--- src/layouts/BaseLayout.astro
const navigation = [
  { href: homePath(), label: "首页" },
  { href: archivePath(), label: "归档" },
  { href: tagsPath(), label: "标签" },
  { href: feedPath(), label: "RSS" },
];
---

<body class="editorial-theme">
  <header class="site-header site-header--editorial">
    <div class="site-shell site-header__inner site-header__inner--editorial">
      <a class="site-brand site-brand--editorial" href={homePath()}>
        <span class="site-brand__name">{siteConfig.siteTitle}</span>
        <span class="site-brand__tagline">Writing archive</span>
      </a>
      <nav class="site-nav site-nav--editorial" aria-label="主导航">
        {navigation.map((item) => (
          <a class="site-nav__link" href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  </header>
  <main class="site-main site-main--editorial">
    <div class="site-shell site-shell--editorial">
      <slot />
    </div>
  </main>
  <footer class="site-footer site-footer--editorial">
    <div class="site-shell site-footer__inner site-footer__inner--editorial">
      <p>{siteConfig.siteDescription}</p>
      <p>Published with Astro.</p>
    </div>
  </footer>
</body>
```

```astro
--- src/pages/index.astro
<BaseLayout canonicalPath={homePath()}>
  <section class="page-intro page-intro--home">
    <p class="page-intro__eyebrow">Writing archive</p>
    <h1>{siteConfig.siteTitle}</h1>
    <p class="page-intro__lead">{siteConfig.siteDescription}</p>
  </section>

  <section class="home-section">
    <div class="section-heading section-heading--home">
      <div>
        <p class="section-heading__eyebrow">Latest writing</p>
        <h2>最新文章</h2>
      </div>
      <span>{posts.length} 篇已发布</span>
    </div>
    <PostList posts={posts} />
  </section>
</BaseLayout>
```

```css
/* src/styles/global.css */
:root {
  color-scheme: light;
  --bg: #f3ede4;
  --bg-soft: #faf6ef;
  --surface: #fffdf9;
  --surface-soft: #f7f1e8;
  --border: rgba(78, 61, 39, 0.16);
  --border-strong: rgba(78, 61, 39, 0.28);
  --text: #1f1a17;
  --text-soft: #55483d;
  --text-muted: #7c6d5d;
  --accent: #7a5b33;
  --accent-strong: #5b4223;
  --code-bg: #f6f0e8;
  --shadow: none;
}

body.editorial-theme {
  margin: 0;
  min-width: 320px;
  font-family:
    Inter,
    "SF Pro Display",
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.8;
}

.site-shell {
  width: min(100% - 2rem, 72rem);
  margin: 0 auto;
}

.site-header--editorial {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(243, 237, 228, 0.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
}

.site-header__inner--editorial {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.1rem 0 1rem;
}

.site-brand--editorial {
  display: inline-flex;
  flex-direction: column;
  gap: 0.18rem;
}

.site-brand__name {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0;
}

.site-brand__tagline {
  color: var(--text-muted);
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.site-nav--editorial {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.site-nav__link {
  color: var(--text-soft);
  font-size: 0.95rem;
}

.site-main--editorial {
  padding: 0 0 4.5rem;
}

.site-footer--editorial {
  border-top: 1px solid var(--border);
  background: transparent;
}

.site-footer__inner--editorial {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1.5rem 0 2.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.page-intro--home {
  padding: 6.25rem 0 2.4rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.5rem;
}

.page-intro__eyebrow,
.section-heading__eyebrow {
  margin: 0 0 0.85rem;
  color: var(--text-muted);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.page-intro--home h1,
.post-hero--editorial h1,
.not-found h1 {
  margin: 0;
  font-family:
    "Iowan Old Style",
    "Palatino Linotype",
    "Book Antiqua",
    Georgia,
    serif;
  font-size: 4.2rem;
  line-height: 0.98;
  letter-spacing: 0;
}

.page-intro__lead,
.post-hero__summary,
.not-found p {
  max-width: 37rem;
  margin: 1rem 0 0;
  color: var(--text-soft);
  font-size: 1.12rem;
}

.section-heading--home {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
}

.section-heading--home h2 {
  margin: 0;
  font-size: 1.35rem;
}

.section-heading--home span {
  color: var(--text-muted);
  font-size: 0.92rem;
}
```

- [ ] **Step 4: Run the homepage shell test again and then a full type/build smoke check**

Run:

```bash
npx vitest run tests/editorial-shell.test.ts
npm run check
npm run build
```

Expected:

- `tests/editorial-shell.test.ts` passes
- `astro check` completes without new diagnostics
- `astro build` completes successfully

- [ ] **Step 5: Commit the shell and homepage intro work**

```bash
git add tests/helpers/rendered-html.ts tests/editorial-shell.test.ts src/layouts/BaseLayout.astro src/pages/index.astro src/styles/global.css
git commit -m "feat: add editorial shell and homepage intro"
```

### Task 2: Convert Lists, Archive, and Tags into Editorial Indexes

**Files:**
- Create: `tests/editorial-indexes.test.ts`
- Modify: `src/components/PostList.astro`
- Modify: `src/components/TagPill.astro`
- Modify: `src/pages/archives/index.astro`
- Modify: `src/pages/tags/index.astro`
- Modify: `src/pages/tags/[tag].astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write the failing regression test for post indexes and taxonomy pages**

```ts
// tests/editorial-indexes.test.ts
import { describe, expect, it } from "vitest";

import { readBuiltPage } from "./helpers/rendered-html";

describe("editorial indexes", () => {
  it("renders shared post rows instead of cards on listing pages", () => {
    const home = readBuiltPage("index.html");
    const archive = readBuiltPage("archives/index.html");
    const tags = readBuiltPage("tags/index.html");
    const astroTag = readBuiltPage("tags/astro/index.html");

    expect(home).toContain('class="post-list post-list--editorial"');
    expect(home).toContain('class="post-row__date"');
    expect(home).not.toContain('class="post-card"');

    expect(archive).toContain('class="archive-page archive-page--editorial"');
    expect(archive).toContain('class="archive-list archive-list--editorial"');

    expect(tags).toContain('class="tags-page tags-page--editorial"');
    expect(tags).toContain('class="tags-grid tags-grid--editorial"');

    expect(astroTag).toContain('class="tag-page tag-page--editorial"');
    expect(astroTag).toContain('class="post-list post-list--editorial"');
  });
});
```

- [ ] **Step 2: Run the index regression test to verify it fails**

Run:

```bash
npx vitest run tests/editorial-indexes.test.ts
```

Expected: FAIL because the homepage and tag page still render `.post-card`, and the archive/tag pages do not yet expose the new editorial modifiers.

- [ ] **Step 3: Implement editorial row markup for post lists, archive, and tags**

```astro
--- src/components/PostList.astro
<ol class="post-list post-list--editorial">
  {
    posts.map((post) => (
      <li class="post-row">
        <article class="post-row__article">
          <time class="post-row__date" datetime={post.data.date.toISOString()}>
            {formatDisplayDate(post.data.date)}
          </time>
          <div class="post-row__body">
            <h2 class="post-row__title">
              <a href={postPath(post.id)}>{post.data.title}</a>
            </h2>
            <p class="post-row__summary">{post.data.summary}</p>
            <div class="tag-list tag-list--editorial" aria-label="文章标签">
              {post.data.tags.map((tag) => <TagPill tag={tag} />)}
            </div>
          </div>
        </article>
      </li>
    ))
  }
</ol>
```

```astro
--- src/components/TagPill.astro
<a class="tag-pill tag-pill--editorial" href={tagPath(tag)}>
  #{tag}
</a>
```

```astro
--- src/pages/archives/index.astro
<BaseLayout
  title="归档"
  description="按时间顺序查看全部公开文章。"
  canonicalPath={archivePath()}
>
  <section class="archive-page archive-page--editorial">
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
            <ul class="archive-list archive-list--editorial">
              {group.entries.map((post) => (
                <li class="archive-list__item">
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
</BaseLayout>
```

```astro
--- src/pages/tags/index.astro
<BaseLayout
  title="标签"
  description="按主题浏览公开文章。"
  canonicalPath={tagsPath()}
>
  <section class="tags-page tags-page--editorial">
    <div class="section-heading section-heading--index">
      <div>
        <p class="section-heading__eyebrow">Topics</p>
        <h1 class="tags-page__heading">标签</h1>
      </div>
      <span>{tagSummaries.length} 个主题</span>
    </div>

    {
      tagSummaries.length > 0 ? (
        <div class="tags-grid tags-grid--editorial">
          {tagSummaries.map((summary) => (
            <a class="tag-pill tag-pill--editorial tag-pill--count" href={tagPath(summary.tag)}>
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
</BaseLayout>
```

```astro
--- src/pages/tags/[tag].astro
<BaseLayout
  title={`标签：${tag}`}
  description={`收录与 ${tag} 相关的公开文章。`}
  canonicalPath={tagPath(tag)}
>
  <section class="tag-page tag-page--editorial">
    <div class="section-heading section-heading--index">
      <div>
        <p class="section-heading__eyebrow">Topic archive</p>
        <h1 class="tag-page__heading">#{tag}</h1>
      </div>
      <span class="tag-meta">{posts.length} 篇文章</span>
    </div>
    <PostList posts={posts} />
  </section>
</BaseLayout>
```

```css
/* src/styles/global.css */
.section-heading--index {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-heading--index h1,
.section-heading--index h2 {
  margin: 0;
}

.section-heading--index span,
.archive-group__count,
.tag-meta,
.empty-state {
  color: var(--text-muted);
  font-size: 0.92rem;
}

.post-list--editorial {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--border);
}

.post-row {
  padding: 1.3rem 0;
  border-bottom: 1px solid var(--border);
}

.post-row__article {
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
  font-family:
    "Iowan Old Style",
    "Palatino Linotype",
    "Book Antiqua",
    Georgia,
    serif;
  font-size: 1.7rem;
  line-height: 1.1;
}

.post-row__summary {
  margin: 0.55rem 0 0;
  color: var(--text-soft);
  font-size: 1rem;
}

.tag-list--editorial {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.9rem;
}

.tag-pill--editorial {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 1.9rem;
  padding: 0.18rem 0.55rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-soft);
  background: rgba(255, 253, 249, 0.78);
  font-size: 0.82rem;
}

.tag-pill__count {
  color: var(--text-muted);
}

.archive-page--editorial,
.tags-page--editorial,
.tag-page--editorial {
  padding: 4.25rem 0 0;
}

.archive-groups {
  display: grid;
  gap: 2rem;
}

.archive-list--editorial {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--border);
}

.archive-list__item {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  gap: 1.25rem;
  padding: 0.95rem 0;
  border-bottom: 1px solid var(--border);
}

.archive-link {
  font-size: 1.02rem;
}

.tags-grid--editorial {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-pill--count {
  justify-content: space-between;
  min-width: 10rem;
}
```

- [ ] **Step 4: Run the index regression test and the shared validation commands**

Run:

```bash
npx vitest run tests/editorial-indexes.test.ts
npm run check
npm run build
```

Expected:

- `tests/editorial-indexes.test.ts` passes
- homepage, archive, tags index, and tag detail pages all build successfully
- `astro check` reports no new problems

- [ ] **Step 5: Commit the editorial index work**

```bash
git add tests/editorial-indexes.test.ts src/components/PostList.astro src/components/TagPill.astro src/pages/archives/index.astro src/pages/tags/index.astro 'src/pages/tags/[tag].astro' src/styles/global.css
git commit -m "feat: convert blog indexes to editorial lists"
```

### Task 3: Redesign the Article Page, TOC, and Pagination

**Files:**
- Create: `tests/editorial-post-page.test.ts`
- Modify: `src/pages/posts/[slug].astro`
- Modify: `src/components/TableOfContents.astro`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write the failing regression test for the article page layout**

```ts
// tests/editorial-post-page.test.ts
import { describe, expect, it } from "vitest";

import { readBuiltPage } from "./helpers/rendered-html";

describe("editorial post page", () => {
  it("renders an editorial hero, quiet toc, and text-led pager", () => {
    const html = readBuiltPage("posts/from-empty-repo-to-pages/index.html");

    expect(html).toContain('class="post-page post-page--editorial"');
    expect(html).toContain('class="post-hero post-hero--editorial"');
    expect(html).toContain('class="post-layout post-layout--editorial"');
    expect(html).toContain('class="prose prose--editorial"');
    expect(html).toContain('class="toc toc--editorial"');
    expect(html).toContain('class="article-pagination article-pagination--editorial"');
    expect(html).not.toContain('class="pager-card"');
  });
});
```

- [ ] **Step 2: Run the article-page regression test to verify it fails**

Run:

```bash
npx vitest run tests/editorial-post-page.test.ts
```

Expected: FAIL because the built post page still exposes `.post-page`, `.post-hero`, `.toc`, and `.pager-card` without the new editorial structure.

- [ ] **Step 3: Implement the editorial article hero, TOC, pager, and responsive reading styles**

```astro
--- src/pages/posts/[slug].astro
<BaseLayout
  title={post.data.title}
  description={post.data.summary}
  canonicalPath={postPath(post.id)}
>
  <article class="post-page post-page--editorial">
    <header class="post-hero post-hero--editorial">
      <p class="post-hero__eyebrow">Essay</p>
      <div class="post-hero__meta">
        <time datetime={post.data.date.toISOString()}>
          {formatDisplayDate(post.data.date)}
        </time>
        <span>#{post.id}</span>
      </div>
      <h1>{post.data.title}</h1>
      <p class="post-hero__summary">{post.data.summary}</p>
      <div class="post-hero__tags post-hero__tags--editorial" aria-label="文章标签">
        {post.data.tags.map((tag) => <TagPill tag={tag} />)}
      </div>
    </header>

    <div class="post-layout post-layout--editorial">
      <div class="post-content">
        <div class="prose prose--editorial">
          <Content />
        </div>

        <footer class="post-footer post-footer--editorial">
          <p class="post-footer__caption">继续阅读</p>
          <nav class="article-pagination article-pagination--editorial" aria-label="相邻文章">
            <div class="article-pagination__item">
              <span class="article-pagination__label">较新</span>
              {newer ? (
                <a class="article-pagination__link" href={postPath(newer.id)}>
                  {newer.data.title}
                </a>
              ) : (
                <span class="article-pagination__empty">已经是最新一篇</span>
              )}
            </div>
            <div class="article-pagination__item">
              <span class="article-pagination__label">较早</span>
              {older ? (
                <a class="article-pagination__link" href={postPath(older.id)}>
                  {older.data.title}
                </a>
              ) : (
                <span class="article-pagination__empty">已经是最早一篇</span>
              )}
            </div>
          </nav>
        </footer>
      </div>

      <div class="post-sidebar post-sidebar--editorial">
        <TableOfContents headings={headings} />
      </div>
    </div>
  </article>
</BaseLayout>
```

```astro
--- src/components/TableOfContents.astro
{
  visibleHeadings.length > 0 && (
    <aside class="toc toc--editorial" aria-labelledby="toc-title">
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
  )
}
```

```css
/* src/styles/global.css */
.post-page--editorial {
  padding: 4.75rem 0 0;
}

.post-hero--editorial {
  max-width: 50rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.post-hero__eyebrow,
.toc__eyebrow {
  margin: 0 0 0.8rem;
  color: var(--text-muted);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.post-hero__meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.post-hero__tags--editorial {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 1.1rem;
}

.post-layout--editorial {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 14rem;
  gap: 4rem;
  padding-top: 2.4rem;
}

.post-sidebar--editorial {
  position: sticky;
  top: 6rem;
  align-self: start;
}

.toc--editorial {
  padding-left: 1rem;
  border-left: 1px solid var(--border);
}

.toc__title {
  margin: 0 0 0.85rem;
  color: var(--text);
  font-size: 0.95rem;
}

.toc__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.55rem;
}

.toc__item a {
  color: var(--text-soft);
  font-size: 0.92rem;
}

.toc__item--depth-3 a {
  padding-left: 0.85rem;
  color: var(--text-muted);
}

.prose--editorial {
  max-width: 44rem;
  color: var(--text);
  font-size: 1.05rem;
}

.prose--editorial p,
.prose--editorial ul,
.prose--editorial ol,
.prose--editorial blockquote {
  color: var(--text-soft);
}

.prose--editorial blockquote {
  padding: 0.95rem 1rem;
  border-left: 2px solid var(--accent);
  background: rgba(122, 91, 51, 0.07);
  border-radius: 0 6px 6px 0;
}

.prose--editorial :not(pre) > code {
  background: rgba(122, 91, 51, 0.08);
}

.prose--editorial pre {
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--code-bg) !important;
}

.post-footer--editorial {
  margin-top: 3rem;
  padding-top: 1.2rem;
  border-top: 1px solid var(--border);
}

.post-footer__caption {
  color: var(--text-muted);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.article-pagination--editorial {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.article-pagination__item {
  display: grid;
  gap: 0.28rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border);
}

.article-pagination__label {
  color: var(--text-muted);
  font-size: 0.82rem;
}

.article-pagination__link {
  font-size: 1rem;
  line-height: 1.45;
}

.article-pagination__empty {
  color: var(--text-muted);
  font-size: 1rem;
}

@media (max-width: 900px) {
  .post-layout--editorial {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }

  .post-sidebar--editorial {
    position: static;
  }
}

@media (max-width: 720px) {
  .site-header__inner--editorial,
  .site-footer__inner--editorial,
  .section-heading--home,
  .section-heading--index {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-intro--home,
  .post-page--editorial,
  .archive-page--editorial,
  .tags-page--editorial,
  .tag-page--editorial,
  .not-found {
    padding-top: 3rem;
  }

  .page-intro--home h1,
  .post-hero--editorial h1,
  .not-found h1 {
    font-size: 2.85rem;
  }

  .post-row__article,
  .archive-list__item,
  .article-pagination--editorial {
    grid-template-columns: minmax(0, 1fr);
  }
}
```

- [ ] **Step 4: Run the article-page regression test and the full validation suite**

Run:

```bash
npx vitest run tests/editorial-post-page.test.ts
npm test
npm run check
npm run build
```

Expected:

- `tests/editorial-post-page.test.ts` passes
- the full Vitest suite passes, including the new build-based regression tests
- `astro check` passes
- `astro build` succeeds with the redesigned article layout

- [ ] **Step 5: Commit the article page redesign**

```bash
git add tests/editorial-post-page.test.ts 'src/pages/posts/[slug].astro' src/components/TableOfContents.astro src/styles/global.css
git commit -m "feat: redesign post pages with editorial layout"
```

## Self-Review

- **Spec coverage:** Task 1 covers the visual-system pivot, global shell, and homepage intro. Task 2 covers the post-list redesign, archive page, tags index, tag detail page, and quiet metadata styling. Task 3 covers the article page, TOC, previous/next navigation, responsive behavior, and full validation.
- **Placeholder scan:** No `TODO`, `TBD`, or generic “handle this later” steps remain. Every task includes exact files, commands, and concrete code blocks.
- **Type and naming consistency:** The plan uses the same modifier vocabulary throughout: `--editorial`, `post-row__*`, `section-heading--*`, `toc--editorial`, and `article-pagination--editorial`.
