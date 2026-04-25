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
