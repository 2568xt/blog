---
title: ReAct 论文笔记：Agent 工具链为什么需要推理和行动交替
date: 2026-06-07
summary: 从今天的 Agent 工程实践反看 ReAct，梳理语言模型如何通过 Thought、Action、Observation 循环把推理、工具调用和环境反馈接在一起，并分析这种范式对可调试性、失败恢复和工具设计的启发。
tags:
  - ai-agent
  - react
  - tool-use
  - reasoning
  - paper
draft: true
---

参考来源：[ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)。

## 今天的 Agent 问题，ReAct 已经提前点出来了

今天讨论 Agent 时，很容易先落到工具清单上：搜索、浏览器、代码执行、文件系统、数据库、工作流编排。工具越多，系统看起来越像能做事。但真正难的不是让模型“拥有工具”，而是让模型在任务推进过程中知道什么时候该想、什么时候该查、什么时候该行动，以及行动之后如何根据环境反馈修正下一步。

ReAct 论文切中的正是这个问题。它没有把语言模型只当成一个回答问题的文本生成器，也没有把工具调用处理成外部插件式的补丁，而是把推理和行动放进同一条轨迹里：模型先形成中间判断，再选择动作，拿到观察结果后继续更新判断。这个循环后来被很多 Agent 系统继承下来，只是表现形式不再局限于 prompt 里的 `Thought`、`Action`、`Observation` 字段，而是落到了工具调用协议、运行日志、浏览器状态、代码补丁和评测 transcript 这些工程对象里。

论文里的轨迹本身很朴素。以 HotpotQA 和 FEVER 这类需要查 Wikipedia 的任务为例，作者给模型的动作空间主要是搜索实体、在页面里查找字符串、最后提交答案。轨迹大致长成这样：

```text
Question: ...
Thought 1: 先判断需要查哪个实体。
Action 1: Search[...]
Observation 1: 工具返回相关页面片段。
Thought 2: 根据返回内容决定下一步查什么。
Action 2: Lookup[...]
Observation 2: 工具返回命中的句子。
Thought 3: 信息足够，可以合成答案。
Action 3: Finish[...]
```

这里的 `Thought` 是模型写给自己的中间推理，`Action` 是模型选择的外部动作，`Observation` 则不是模型生成的，而是环境或工具返回的结果。今天的 function calling、浏览器 Agent、代码 Agent 和 eval transcript，看起来已经比这个格式复杂很多，但底层仍然在处理同一个问题：模型什么时候该继续想，什么时候该对外部世界做一次动作，以及动作返回之后如何更新下一步判断。

从今天回看，ReAct 的重要性不在于它给 prompt 起了几个固定字段名，而在于它把 Agent 的核心矛盾讲清楚了：语言模型的内部推理如果不能接触外部世界，很容易停在自洽但不可靠的解释里；外部行动如果没有推理轨迹支撑，又会变成一串难以归因的工具调用。Agent 要稳定工作，需要把这两者接起来，并让中间过程足够可观察。

接下来先从几个 Agent 工程问题进入 ReAct：为什么只让模型思考还不够，工具调用如何变成推理链的一部分，轨迹又怎样帮助调试和失败恢复。等这些问题讲清楚之后，再回到这套范式没有直接解决的成本和边界。

## 只让模型思考，为什么不够

## 工具调用不是外挂，而是推理链的一部分

## Thought、Action、Observation 让过程变得可追踪

## ReAct 对 Agent 工程的三个启发

## 这套范式没有解决什么
