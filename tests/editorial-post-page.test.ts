import { describe, expect, it } from "vitest";

import { readBuiltPage } from "./helpers/rendered-html";

describe("quiet product post page", () => {
  it("renders a reading-first post page with quiet product support surfaces", () => {
    const html = readBuiltPage("posts/codex-best-practices-cn/index.html");

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
