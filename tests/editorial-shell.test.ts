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
    expect(html).toContain('<meta name="theme-color" content="#f3ede4">');
    expect(html).toContain(">首页</a>");
    expect(html).toContain(">标签</a>");
    expect(html).toMatch(/\d+ 篇已发布/);
    expect(html).not.toContain("关于视觉、模型与代码的简洁笔记。");
    expect(html).not.toContain(">归档</a>");
    expect(html).not.toContain(">RSS</a>");
    expect(html).not.toContain('rel="alternate" type="application/rss+xml"');
    expect(html).not.toContain("site-header--editorial");
    expect(html).not.toContain("page-intro--home");
    expect(html).not.toContain('<meta name="theme-color" content="#0c0f15">');
  });
});
