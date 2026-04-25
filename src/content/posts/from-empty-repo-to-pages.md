---
title: 从空仓库到 GitHub Pages 的 Astro 博客
date: 2026-04-26
summary: 用 Astro、内容集合和 GitHub Actions，把一个空目录变成可发布的技术博客。
tags:
  - astro
  - github-pages
  - deploy
---

首版博客不需要很重。内容站真正重要的，是**结构稳定、路径稳定、写作阻力低**。

## 为什么先选 Astro

对纯静态博客来说，Astro 的优势很直接：

- 内容集合能把 frontmatter 约束提前到构建阶段
- Markdown 和 MDX 可以共存
- 输出是纯静态文件，挂 GitHub Pages 很顺

这意味着首版不用引入数据库、后端接口和运行时状态，也能把文章、归档和标签页都组织好。

## 子路径部署要先解决

GitHub Pages 项目站不是部署在根路径，而是部署在 `/<repo>/`。

如果首页写成 `/posts/foo/` 这种根路径链接，到了线上就很容易跳错位置。所以这版站点把基础路径单独收口成一个 helper，让首页、文章页、标签页和 RSS 都走同一套规则。

## 内容模型不要漂

首版文章 frontmatter 只保留最基本的几项：

```yaml
title: string
date: string
summary: string
tags: string[]
draft?: boolean
cover?: string
```

字段少一点，写作时更轻，也更容易保证每篇文章都长得一致。

## 自动化发布

发布链路尽量短：

1. 推送到 GitHub 仓库
2. Actions 执行安装和构建
3. 把 `dist/` 上传到 Pages
4. 线上直接刷新生效

这样首版的复杂度就会落在写作和样式上，而不是运维上。
