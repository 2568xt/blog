# ChatGPT Dreaming 阅读笔记写作计划
Created: 2026-06-09

## 目标

把 OpenAI 的 `Dreaming: Better memory for a more helpful ChatGPT` 做成一篇中文阅读笔记，发布前先保留为草稿。文章应帮助读者理解 ChatGPT 记忆系统从 `saved memories` 到 `dreaming` 的变化，并把它落到 Agent 记忆、上下文工程和可控性设计上。

计划产物是对现有草稿 `src/content/posts/chatgpt-memory-dreaming-cn.md` 的重写方向，不直接发布。

## 写作定位

- 文章类型：阅读笔记，不是全文翻译，也不是产品新闻复述。
- 读者对象：关注 Agent、Codex、Claude Code、memory、context engineering 的技术读者。
- 主判断：长期记忆正在从用户手动维护的事实列表，变成后台持续合成、更新、过期和可审计的状态层。
- 语气：延续 `src/content/posts/agent-evals-reading-note-cn.md` 的读法，先解释原文，再给出工程判断。
- 约束：正文避免第一人称“我”；保留 OpenAI 原文链接；新文继续 `draft: true`，审过后再发布。

## 资料边界

- 主来源：OpenAI 原文 `https://openai.com/index/chatgpt-memory-dreaming/`。
- 辅助来源：OpenAI Memory FAQ、ChatGPT release notes，只有在解释用户控制、可见性或推出范围时使用。
- 版权边界：不粘贴完整译文；允许短引用，主体采用摘译、解释和评论。
- 图片边界：优先保留官方图的内容价值和来源说明；是否本地保存图片，需要写作时再确认图片授权、尺寸和站点构建方式。

## 图片保留计划

原文中值得保留的图位：

- Memory Architecture：用于解释 `saved memories`、history、dreaming 和 memory synthesis 的关系。
- Memory settings：用于说明用户控制入口，不把记忆做成不可见黑箱。
- Memory summary：用于说明系统如何向用户展示“它认为自己知道什么”。
- Memory preferences without / with：用于展示没有记忆和有记忆时，新加坡旅行建议的差异。

写作时的默认处理：

- 如果使用原图，放入 `public/images/posts/chatgpt-memory-dreaming-cn/`，正文用 `<figure>` 包装并写清图注与来源。
- 如果不适合直接保存原图，改用 Mermaid 或简化示意图重画架构关系，并在图注里说明根据 OpenAI 原文整理。
- 旅行建议对比图只保留一组最能说明“偏好约束”的图，避免文章变成产品截图堆叠。

## 文章结构

### 1. 开头：记忆不是聊天记录

要点：

- 从 2026 年 6 月 4 日的 OpenAI 更新切入。
- 先点明这不是简单的“ChatGPT 更记得用户”，而是记忆系统的角色变了。
- 给出全文判断：Agent 记忆会影响未来行动，因此更像状态管理系统。

### 2. 第一代记忆：用户手动保存事实

要点：

- 解释 2024 年的 `saved memories`。
- 强调它的优点是可理解、可管理，缺点是覆盖不足且容易过期。
- 不要写成产品功能清单，要落到工程问题：静态事实列表无法承载长期上下文变化。

### 3. Dreaming：后台合成当前状态

要点：

- 解释 2025 年开始的 dreaming，以及 2026 年更新后的更强版本。
- 重点写“合成”而不是“存更多”：系统从历史对话里整理当前仍然有用的记忆。
- 配 Memory Architecture 图或重画架构图。

### 4. 好记忆的三个标准

要点：

- 延续上下文：长期项目不用反复自我介绍。
- 遵守偏好和限制：偏好应成为未来回答和行动的约束。
- 随时间保持新鲜：旅行、地点、阶段性目标都有生命周期。
- 使用原文的新加坡例子说明偏好约束；使用地点过期例子说明 stale memory。

### 5. 对 Agent 工程的启发

要点：

- 上下文窗口和记忆系统不是一回事。
- `AGENTS.md`、自动化记忆、一次性任务日志分别对应不同作用域。
- 记忆系统至少要处理来源、作用域、时间和用户纠正。
- 和本地已有 `ReAct`、`Agent eval` 文章衔接：ReAct 解决任务内观察，memory 解决跨任务状态，eval 负责验证状态是否真的改善任务结果。

### 6. 结尾：越会记，越需要边界

要点：

- 记忆越强，错误状态越容易持续影响未来回答。
- 结尾沉淀成可复用判断：Agent memory 应该像数据库和权限系统一样设计，而不是当成聊天体验优化。
- 不要把结尾写成 OpenAI 产品评价；重点回到 Agent 产品设计。

## 执行步骤

1. 对照 OpenAI 原文补齐当前草稿缺少的例子、图位和时间线。
2. 把现有短评重写成阅读笔记：先原文脉络，再工程判断。
3. 决定图片策略：直接保留官方图、局部保留截图，或重画示意图。
4. 更新 frontmatter 的 `summary`，让它更像阅读笔记而不是短评。
5. 运行 `npm run check` 和 `npm run build`，确认草稿不进入公开路由。
6. 等用户确认后再去掉 `draft: true`，走 PR 发布流程。

## 验收标准

- 文章能让读者不看原文也理解 `saved memories` 到 `dreaming` 的变化。
- 至少保留一个能说明记忆架构或用户控制的图位。
- 正文有明确的 Agent 工程判断，而不是只做 OpenAI 产品介绍。
- 与本地已有 `agent-evals-reading-note-cn.md`、`react-agent-paper-note-cn.md`、`codex-best-practices-cn.md` 不重复。
- 不包含完整原文翻译，不违反版权边界。
- 保持 `draft: true`，直到用户明确批准发布。

## 风险和处理

- OpenAI 页面受 Cloudflare 影响时，优先向用户说明访问问题，再请求用户提供原文或批准替代来源。
- 如果原图授权或下载方式不清晰，优先重画示意图而不是直接搬运。
- 如果文章太像功能介绍，删除产品宣传式段落，保留“为什么这对 Agent 记忆设计重要”的判断。
- 如果例子过多，优先保留新加坡偏好约束和 stale memory 两类例子。
