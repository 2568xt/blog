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
