---
title: Agent 记忆的难处，是让旧前提及时失效
date: 2026-06-09
summary: Agent 记忆应被当成有来源、有作用域、会过期且必须可纠正的状态层，而不是聊天记录的延长线。
tags:
  - ai-agent
  - memory
  - openai
  - context-engineering
---

参考来源：[OpenAI: Dreaming: Better memory for a more helpful ChatGPT](https://openai.com/index/chatgpt-memory-dreaming/)，以及 [Memory FAQ](https://help.openai.com/en/articles/8590148-personalization-and-data-controls-faq)。

“记住更多”听起来像上下文窗口的延长，但真正使用 Agent 时，麻烦往往不是信息不够，而是旧信息仍在影响下一次行动。一个过期的项目阶段、一次性的旅行计划、已经撤销的偏好，都可能让系统给出一条很连贯、却不再适用的建议。

OpenAI 在 2026 年 6 月介绍的 Dreaming 更新，让这个问题更清楚：记忆不是静态笔记，而是从多次对话中合成、随时间更新、还要接受用户检查的状态。值得带走的不是一个功能名，而是这层状态一旦影响未来推理，就应该像数据库和权限系统一样被设计。

## 自动整理以后，谁来纠正整理结果

把一段对话压缩成记忆，必然会发生取舍。用户说“这个项目先用简单方案”，留下来的如果只有“偏好简单方案”，一次局部决定就被提升成了长期偏好。摘要可能每个字都来自对话，却仍然改变了原意。

笔者更担心这种错误，而不是漏记一条信息。漏记时用户还会补充，错误概括却可能被系统悄悄反复使用。聊天记录可以作为回查材料，进入未来任务的记忆还应保留它属于哪个项目、当时解决什么问题。不能仅因为一句话容易概括，就让它获得更长的有效期。

<figure>
  <img src="/blog/images/posts/chatgpt-memory-dreaming-cn/saved-memories.webp" alt="Saved memories 以列表形式保存用户事实" />
  <figcaption>手动保存的记忆容易理解，也暴露了一个问题：静态列表不会自动说明事实何时失效。</figcaption>
</figure>

## 好记忆首先要处理时间

OpenAI 将记忆质量归纳为延续上下文、遵守偏好和限制、随时间保持新鲜三个目标。前两个容易被看见，第三个却决定记忆是否会从帮助变成干扰。

“用户七月要去新加坡”和“用户已经从新加坡回来”不是同一个状态；“用户正在评估某个框架”和“项目已经上线”也不是同一条事实。Dreaming 的价值正在于让系统有机会根据新对话改写旧状态，而不是不断追加互相矛盾的条目。OpenAI 也用旅行偏好和时间变化展示了这一点。

<figure>
  <img src="/blog/images/posts/chatgpt-memory-dreaming-cn/singapore-without-memory.webp" alt="没有利用用户偏好时的新加坡旅行建议" />
  <figcaption>没有上下文时，推荐容易退化成通用景点清单。</figcaption>
</figure>

<figure>
  <img src="/blog/images/posts/chatgpt-memory-dreaming-cn/singapore-with-memory.webp" alt="利用用户偏好后的新加坡旅行建议" />
  <figcaption>偏好进入规划后，记忆改变的是约束和搜索空间，而不只是语气。</figcaption>
</figure>

这里的工程含义很具体：每条长期状态都应有时间语义。它何时成立，什么证据会更新它，冲突时哪条优先，多久没有新证据后应降低权重。没有这些问题的答案，记忆越多，系统越可能稳定地错下去。

## 可见性决定记忆能否被信任

自动合成记忆后，用户控制就不能只剩一个总开关。OpenAI 的 memory summary 让用户查看系统概括出的信息，FAQ 也说明用户可以修正、删除或关闭记忆，并能查看某些个性化来源。[Memory FAQ](https://help.openai.com/en/articles/8590148-personalization-and-data-controls-faq)

这类界面不是产品附属功能，而是状态层的调试入口。用户看不见系统如何概括自己，就无法判断某条推荐为何偏离，也无法及时修正错误偏好。即使摘要不展示所有内部因素，至少它把“系统记住了什么”从黑箱变成可检查对象。

对 Agent 来说，可见性还要覆盖作用域：个人偏好、项目状态、团队规则和一次性任务不能混成一个长期画像。代码仓库的稳定约定适合写在 `AGENTS.md`，一次执行中的报错和临时分支不应自动升级成永久经验；跨项目误用状态，往往比完全没有记忆更危险。

<figure>
  <img src="/blog/images/posts/chatgpt-memory-dreaming-cn/memory-settings.webp" alt="ChatGPT 记忆设置用于管理长期状态" />
  <figcaption>设置页提供的是开关；真正的控制还需要解释、修改和删除。</figcaption>
</figure>

<figure>
  <img src="/blog/images/posts/chatgpt-memory-dreaming-cn/memory-summary.webp" alt="Memory summary 展示系统对用户长期信息的概括" />
  <figcaption>摘要让用户有机会检查系统形成的概括，而不是只能从错误回答反推它记住了什么。</figcaption>
</figure>

## 删除也需要能验收的结果

记忆可见以后，还有一个更难的问题：删掉摘要里的一条信息，是否就能保证它不再影响后续回答？如果原始对话仍然会被重新提炼，同一个判断可能再次出现。这里的删除至少涉及保存的状态、它的来源，以及后台如何处理已撤回的信息。

对自己设计的 Agent，笔者会把“不要再据此判断”当成需要单独保存和检查的约束。否则用户每次纠正，系统每次重新学回来，界面上的删除按钮就只解决了暂时看不见的问题。这是希望系统达到的控制语义，不能仅凭一个设置页就认定实现已经做到。

比起继续提高记忆覆盖率，更值得先检查一个朴素场景：把“正在评估框架”改成“已经选定方案”以后，下一次任务能否真的从新阶段开始。如果它还在反复推荐选型，说明记忆被保存了，状态却没有更新。长期协作会从这种小地方失去耐心。
