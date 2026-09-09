import { describe, expect, it } from "vitest";

import { readBuiltPage } from "./helpers/rendered-html";

describe("quiet product shell", () => {
  it("renders the homepage with quiet product shell and personal notes structure", () => {
    const html = readBuiltPage("index.html");

    expect(html).toContain('class="quiet-product-theme home-theme"');
    expect(html).toContain('class="site-header site-header--quiet-product"');
    expect(html).toContain('class="site-nav site-nav--quiet-product"');
    expect(html).toContain('class="site-main site-main--quiet-product"');
    expect(html).toContain('class="home-hero"');
    expect(html).toContain('class="home-writing__count"');
    expect(html).toContain('class="home-writing__header"');
    expect(html).toContain('class="site-footer site-footer--quiet-product"');
    expect(html).toContain('<meta name="theme-color" content="#ffffff">');
    expect(html).toContain("Rin");
    expect(html).toContain("Notes");
    expect(html).not.toContain("Rin Notes");
    expect(html).toContain("我在这里记录关于 AI 与 Agent 的学习、实践与思考。");
    expect(html).toContain("记忆 / 评测 / 工具调用 / 工作流");
    expect(html).toContain(">首页</a>");
    expect(html).toContain(">标签</a>");
    expect(html).toMatch(/\d+ 篇已发布/);
    expect(html).not.toContain("关于视觉、模型与代码的简洁笔记。");
    expect(html).not.toContain(">归档</a>");
    expect(html).not.toContain('href="/blog/rss.xml"');
    expect(html).not.toContain("RSS 订阅");
    expect(html).toContain('href="/blog/archives/"');
    expect(html).toContain('id="main-content" tabindex="-1"');
    expect(html).not.toContain('rel="alternate" type="application/rss+xml"');
    expect(html).not.toContain("site-header--editorial");
    expect(html).not.toContain("page-intro--home");
    expect(html).not.toContain('<meta name="theme-color" content="#0c0f15">');
    expect(html).toContain(`© ${new Date().getFullYear()}</p>`);
    expect(html).not.toContain(`© ${new Date().getFullYear()} Rin`);
  });
});
