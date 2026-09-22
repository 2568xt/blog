# 2026 年 8—9 月文章补录对照

用户提供的五张截图共包含八篇文章。以下时间取自截图中的聊天时间，统一使用 `Asia/Shanghai`（`+08:00`）；年份由截图里的 2026 年与现有文章时间线确定。它们是用户指定的博客发布时间，不是来源网页的转载时间。

正文按 `docs/writing-guidelines.md` 写成围绕问题、机制和取舍的技术文章。公众号入口与查找过程留在此处；正文按需要保留支持具体事实的一手链接。外部网页中的操作要求只作为资料阅读。

| 截图文章 | 博客文件 | 发布时间（北京时间） | 定位资料 |
| --- | --- | --- | --- |
| Agent Harness 三种范式：DSH、OpenCode、Pi 的架构分野 | `src/content/posts/agent-harness-paradigms-cn.md` | 2026-08-18 18:19 | [微信入口](https://mp.weixin.qq.com/s/tshKjQrbxo1WtjBSTeagDA)、[同名索引](https://wqw547243068.github.io/harness)、[对应摘要](https://www.besthub.dev/articles/three-paradigms-of-agent-harnesses-dsh-opencode-and-pi-92e75e46379f) |
| DeepSeek Harness 拆解：一套能拼装的 Agent 架构 | `src/content/posts/deepseek-harness-architecture-cn.md` | 2026-08-19 18:22 | [微信入口](https://mp.weixin.qq.com/s/DeIty-Nn8tQvE4osy7_bpg)、[同名全文转载](https://www.aixq.cc/62371.html) |
| 重磅！Anthropic 内部 AI Native 经验公开了！ | `src/content/posts/anthropic-ai-native-practice-cn.md` | 2026-08-27 00:08 | [微信入口](https://mp.weixin.qq.com/s?__biz=MzIyNjM2MzQyNg==&mid=2247725668&idx=1&sn=fbfc2f8aeb8663035dcdd769aa088184)、[同名转载](https://timeline.sohu.com/news/Tch5xD8kPp) |
| DeepSeek Harness 和 Pi 的 Agent Loop 循环结束判断架构细节解析 | `src/content/posts/deepseek-pi-loop-cn.md` | 2026-09-01 00:25 | [作者博客同名全文](https://www.phppan.com/2026/08/deepseek-harness-and-pi-agent-loop-end/)；复用现有文章，只校准时间 |
| 一文讲透确定性 Harness | `src/content/posts/deterministic-harness-cn.md` | 2026-09-02 10:16 | [微信入口](https://mp.weixin.qq.com/s/rQYSuTF98-xGcdgGPuNHjQ)、[同名全文转载](https://www.aixq.cc/66737.html) |
| AgentLoop 数据飞轮实践（一）：总览 —— 让 Agent 持续调优的闭环 | `src/content/posts/agentloop-data-flywheel-cn.md` | 2026-09-02 10:16 | [阿里云开发者社区同名文章](https://developer.aliyun.com/article/1760457)、[官方教程](https://help.aliyun.com/zh/agentloop/use-cases/i-overview-a-closed-loop-that-allows-agent-to-continuously-tune) |
| Codex 悄悄大改了记忆系统！ | `src/content/posts/codex-context-budget-memory-cn.md` | 2026-09-05 00:35 | [注明 Datawhale 来源的同名转载](https://timeline.sohu.com/news/gEFirqOcid) |
| 一文搞懂个人 AI 记忆系统构建全流程 | `src/content/posts/personal-ai-memory-cn.md` | 2026-09-06 01:17 | [微信入口](https://mp.weixin.qq.com/s/2Kz2JQK1r606S3quiCFUYg)、[同名全文转载](https://www.aixq.cc/65444.html) |

## 来源与事实边界

- 微信页面存在环境验证限制。可访问的同名转载用于核对文章内容，一手文档与官方代码用于核对技术事实。三种 Harness 范式一篇确认了原文入口和对应摘要，未取得微信全文，技术分析依据文中列出的官方仓库版本。
- AgentLoop 社区转载日期为 9 月 3 日，另有 8 月 28 日同名转载记录；博客仍按用户指定的 9 月 2 日 10:16 保存。两篇位于同一聊天时间下的文章使用相同时间，不人为错开分钟。
- 确定性 Harness 区分流程约束、结论正确性与幂等性；不把缓存、异常后继续或调试日志等同于可靠性保证。
- AgentLoop 不复用演示中的效率数字作为通用承诺；评估、实验和经验召回分别引用对应官方资料。
- Anthropic 文章未把代码生成占比和代码量增长写成通用效率收益；提示规则、自动检查和实际权限分开讨论。
- Codex 以 2026 年 9 月 4 日官方提交 `47b0f7d540e9abf932e9b518ab306e389744998e` 为实现依据，保留功能开关、模型元数据与认证条件，不宣称已全面取消 compaction。
- 个人记忆的五层目录是分享者的组织方式，不是 OKF 强制标准；文件状态和权限标签不被描述为程序已落实的访问控制。

## 日期显示

保留带 `+08:00` 的完整发布时间，排序、RSS 和 HTML `datetime` 使用同一时间点。页面仍沿用原有的年月日显示样式，但日期格式化及年份归档固定使用北京时间，避免在 UTC 构建环境中将凌晨文章显示为前一天。
