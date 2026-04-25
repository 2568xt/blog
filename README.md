# 2568xt Blog

一个基于 Astro 的极简深色技术博客，默认部署到 GitHub Pages 项目站：

- 预期线上地址：`https://2568xt.github.io/blog/`
- 技术栈：`Astro + Content Collections + Markdown/MDX + GitHub Actions`
- 内容模型：`title / date / summary / tags / draft / cover`

## 本地开发

```bash
npm install
npm run dev
```

## 校验与构建

```bash
npm test
npm run check
npm run build
npm run preview
```

## 目录

- `src/content/posts/`：文章内容
- `src/content.config.ts`：内容集合定义
- `src/layouts/`：页面布局
- `src/components/`：文章列表、目录等组件
- `src/lib/`：文章处理和路由工具
- `.github/workflows/deploy.yml`：GitHub Pages 自动部署
