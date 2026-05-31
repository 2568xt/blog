import { describe, expect, it } from "vitest";

import { readBuiltPage } from "./helpers/rendered-html";

describe("quiet product indexes", () => {
  it("renders shared quiet product post streams on listing pages", () => {
    const home = readBuiltPage("index.html");
    const codexTag = readBuiltPage("tags/codex/index.html");

    for (const html of [home, codexTag]) {
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

  it("renders archive and tag indexes with quiet product classes", () => {
    const archive = readBuiltPage("archives/index.html");
    const tags = readBuiltPage("tags/index.html");
    const codexTag = readBuiltPage("tags/codex/index.html");

    expect(archive).toContain('class="archive-page archive-page--quiet-product"');
    expect(archive).toContain('class="archive-list archive-list--quiet-product"');
    expect(archive).toContain(
      'class="archive-list__item archive-list__item--quiet-product"',
    );
    expect(archive).not.toContain("archive-page--editorial");

    expect(tags).toContain('class="tags-page tags-page--quiet-product"');
    expect(tags).toContain('class="tags-grid tags-grid--quiet-product"');
    expect(tags).toContain('class="tag-pill tag-pill--quiet-product tag-pill--count"');
    expect(tags).not.toContain("tags-page--editorial");

    expect(codexTag).toContain('class="tag-page tag-page--quiet-product"');
    expect(codexTag).toContain('class="post-list post-list--quiet-product"');
  });
});
