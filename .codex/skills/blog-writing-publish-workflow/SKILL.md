---
name: blog-writing-publish-workflow
description: "用于本仓库的博客工作：起草或改写 src/content/posts 下的文章，处理基于外部来源的阅读笔记，发起整篇 Proof 审稿，吸收审稿批注，按 PR 发布已获批准的文章，PR 检查通过且变更范围干净后自行合并，并清理分支。不要用于每日新闻或每日摘要筛选自动化。"
---

# 博客写作发布工作流

## 核心规则

行动前先读取当前仓库文件。起草、改写、审稿或发布文章前，先读 `AGENTS.md` 和 `docs/writing-guidelines.md`。

始终把 `src/content/posts/` 当作内容的权威来源。Proof 只是审稿界面，不是正式内容来源。

## 工作流路由

按任务选择对应流程：

- **起草或改写文章：**读取 `references/writing-workflow.md`，根据任务选择整篇处理或按小节推进。
- **准备整篇审稿：**读取 `references/writing-workflow.md`，保持文章草稿状态，只在完整草稿存在后使用 Proof。
- **发布已批准文章：**读取 `references/publish-workflow.md`，确认用户已明确批准发布，运行仓库检查，创建 PR，并只在 PR 变更范围干净后自行合并。
- **每日摘要或新闻筛选：**停止使用本 skill。该流程是独立工作流，不属于这里。

## 操作约束

- 新文章默认保留 `draft: true`，直到用户明确批准发布。
- 外部材料文章保留来源链接，但不要加入与主题无关的写作过程说明。
- 不要提交 Proof token URL、access token、owner secret、审稿状态、`dist/`、缓存、本地环境文件或生成产物。
- 优先做窄改动，只动任务涉及的文章、文档或 workflow 文件。
- 如果来源链接无法访问，立即说明，并询问用户提供材料或批准使用其他来源。

## 参考文件

- `references/writing-workflow.md`：写作风格、基于来源的文章处理、协作粒度选择、Proof 审稿和批注吸收。
- `references/publish-workflow.md`：发布批准门槛、验证、PR 创建、自合并和分支清理。
