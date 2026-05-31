---
title: Agent 评测不是跑分：把“感觉变差了”变成工程信号
date: 2026-05-31
summary: 基于 Anthropic 的 Agent eval 文章，整理一套从真实失败、可验证结果和 transcript 读法出发的评测思路。
tags:
  - ai-agent
  - eval
  - anthropic
draft: true
---

参考来源：[Anthropic Engineering: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)。

很多 Agent 项目早期都能靠手工试用推进：改一段 prompt，跑几个熟悉案例，看看输出有没有明显变好。这个阶段的反馈很快，也很有成就感。但系统一旦进入真实用户场景，问题会变得尴尬：用户说“最近好像变差了”，研发团队却很难判断到底是模型退步、prompt 改坏、工具链出错，还是某个偶发案例被放大了。

Anthropic 这篇文章的价值，不在于列了一组评测框架名称，而是把 Agent eval 放回工程现场：评测要回答的不是“这个模型厉不厉害”，而是“这个 Agent 在具体任务、具体环境、具体约束下，是否稳定地产生了用户真正需要的结果”。换句话说，eval 要把模糊的体感问题，变成可以复现、可以归因、可以讨论的工程信号。

<figure>
  <img src="/blog/images/posts/agent-evals-reading-note-cn/eval-loop.svg" alt="Agent eval 中 task、trial、transcript、outcome 和 grader 的关系图" />
  <figcaption>一轮 eval 可以先理解成：给 Agent 一道 task，让它在隔离环境中跑一次 trial，留下 transcript 和 outcome，再由 grader 判定是否成功。</figcaption>
</figure>

先把几个容易混在一起的词放在同一张桌面上：

| 术语 | 可以先这样理解 |
| --- | --- |
| `task` | 一道题，包含输入和成功标准。 |
| `trial` | 对同一道题的一次尝试。因为 Agent 有随机性，同一个 task 往往要跑多次 trial。 |
| `transcript` | 一次 trial 的完整过程记录，包括模型回复、工具调用、中间结果和交互历史。 |
| `outcome` | trial 结束后环境里的最终事实，比如数据库、文件系统、页面状态、测试结果。 |
| `grader` | 判分逻辑，可以是单元测试、状态检查、静态分析、LLM judge 或人工审核。 |
| `agent harness` | 让模型像 Agent 一样行动的运行框架，负责组织输入、工具调用和返回结果。 |
| `evaluation harness` | 跑评测的基础设施，负责任务调度、环境隔离、记录过程、调用 grader 和汇总结果。 |
| `suite` | 一组围绕同类能力或行为设计的 task。 |

文中的 `reservation` 不是 eval 通用术语，只是订票例子里的“预订记录”。它用来说明一个关键区别：Agent 说“已经订好了”属于 transcript，数据库里真的出现一条预订记录才属于 outcome。

## 为什么 Agent 更难评测

普通 LLM 评测通常比较直观：给一个 prompt，拿到一个 response，再用规则、参考答案或人工判断打分。这里的对象相对稳定，评测逻辑也容易围绕最终文本展开。Agent 不一样，它不是只生成一段答案，而是在多轮交互里调用工具、读取环境、修改状态，并根据中间结果不断调整下一步动作。

这带来第一个麻烦：错误会传播。单轮问答里，一个不准确的句子通常只影响这次输出；Agent 如果在第 2 轮读错文件、查错数据库、点错页面，后面的工具调用可能都会建立在错误状态上。最终失败并不一定来自最后一步，而可能来自很早之前某个不起眼的动作。

第二个麻烦是，最终文本不等于最终结果。一个订票 Agent 可以在对话末尾说“航班已经预订成功”，但真正该检查的是数据库里有没有生成预订记录；一个代码 Agent 可以解释得很像修好了 bug，但真正该检查的是测试是否通过、漏洞是否被堵住、旧行为是否没有被破坏。Anthropic 用 `outcome` 这个词强调的正是这一点：评测不能只看 `transcript` 里说了什么，还要看环境最后变成了什么。

第三个麻烦是，Agent 可能用评测者没预料到的路径完成任务。传统测试容易假设“正确做法”只有一种，但强模型会绕开静态脚本的边界。原文提到 Claude Opus 4.5 在一个航班预订基准里发现了政策漏洞，按原评测标准算失败，但从用户目标看反而可能是更好的解法。这个例子提醒评测设计者：如果 grader 只奖励固定路径，就可能惩罚真正有效的 Agent 行为。

所以，Agent eval 不能退化成“输出像不像参考答案”。更合理的做法是分层看：任务输入是否清楚，环境是否隔离，工具调用是否留下完整记录，最终状态是否符合目标，grader 是否允许合理的替代解法。分清这些层之后，eval 才能解释“为什么失败”，而不只是给出一个冷冰冰的分数。

## Eval 里真正要分清的对象

<!-- 下一节待写：task、trial、grader、transcript、outcome、evaluation harness、agent harness、suite。 -->

## 不要只看最终答案，也不要迷信轨迹

<!-- 下一节待写：outcome 与 transcript 的互补关系，以及路径约束的脆弱性。 -->

## 不同 Agent 类型对应不同评测组合

<!-- 下一节待写：coding、conversation、research、computer-use agent 的评测差异。 -->

## 从 0 到 1 搭 Eval 的现实路径

<!-- 下一节待写：20-50 个真实失败案例、参考解、正反例、稳定环境、grader 校准。 -->

## 长期维护：读 transcript，比盯分数更重要

<!-- 下一节待写：能力评测饱和、grader bug、套件漂移，以及 eval-driven development。 -->
