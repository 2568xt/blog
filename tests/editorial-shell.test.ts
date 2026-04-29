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
