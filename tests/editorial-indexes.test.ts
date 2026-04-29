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
