---
title: Agentic Engineering 的真正门槛：把技巧变成工程系统
date: 2026-06-05
summary: 基于 Matt Van Horn 的 Agentic Engineering 经验清单，复盘计划、执行、反馈、复用和风险边界如何组成可持续的 Agent 工作流。
tags:
  - ai-agent
  - codex
  - workflow
draft: true
---

参考来源：[Matt Van Horn: Every Agentic Engineering Hack I Know (June 2026)](https://x.com/mvanhorn/article/2061877533885473181)。

## 为什么这篇文章值得复盘

Matt Van Horn 这篇 X Article 表面上是一份很长的技巧清单：`plan.md`、`/ce-plan`、语音输入、并行标签页、`cmux`、权限绕过、`last30days`、原始 transcript、Human Signal、skills、开源贡献、Printing Press，最后还专门谈到 AI psychosis 这样的风险。单独看每一条，都像是某个重度使用者的个人偏好；连在一起看，它其实在回答一个更大的问题：Agentic Engineering 到底怎样从“会用工具”变成“能稳定产出”的工程系统。

这也是它比普通工具列表更值得复盘的地方。很多 agent 工作流的问题，并不是模型完全不能做，而是任务意图没有被写成可执行计划，执行过程没有被拆成可观察的单元，失败信号没有回到原始记录，成功经验也没有沉淀成下一次能复用的规则。于是每次看起来都在“让 AI 帮忙”，但每次都要重新解释、重新纠偏、重新承受同一类风险。

原文真正有价值的判断，是把 agent 当成一个需要工作制度的工程队友，而不是一次性问答界面。计划不是为了让人逐字阅读，而是为了给 agent 一个可执行边界；多标签和并行会话不是为了热闹，而是为了让不同任务线彼此隔离；原始 transcript 和 Human Signal 不是额外记录癖，而是让质量判断回到真实输入、真实反馈和真实失败。

这篇文章也触发了一次本地工作流改造：Compound Engineering 插件被安装到 Claude Code 和 Codex，全局规则里补上了“复杂任务先 plan，执行后 review，最后 compound”的循环；项目规则里也写明，外部源链接打不开时必须先反馈，不能静默改用转载、缓存或搜索摘要。这个细节很重要，因为 agent 的效率一旦提高，错误来源也会被放大。快，不等于可以跳过来源约束。

所以这篇复盘不打算把 22 条技巧逐条翻译一遍。更值得保留下来的，是它背后的五层结构：先把意图变成计划，再把执行拆成可并行但可审查的工作单元，随后用原始信号判断质量，把有效做法沉淀成技能和规则，最后持续提醒自己哪些权限、成本和心理风险不能交给自动化惯性处理。真正的门槛不在某一个插件，而在能不能把这些动作连成一套可持续的工作方式。
