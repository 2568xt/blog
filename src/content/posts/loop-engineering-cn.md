---
title: Loop Engineering：把提示词交给循环
date: 2026-06-12
summary: 顺着 Addy Osmani 的 Loop Engineering，梳理 coding agent 的工作重心如何从写提示词转向设计循环，以及 automations、worktrees、skills、connectors、sub-agents 和外部状态如何组成可持续的 Agent 工作流。
tags:
  - ai-agent
  - codex
  - workflow
---

参考来源：[Addy Osmani: Loop Engineering](https://addyosmani.com/blog/loop-engineering/)。

一开始和 coding agent 配合，很像手里握着一个遥控器。写一句 prompt，等 agent 做一点事；读返回，再补一句；它偏了，就把上下文再塞回去。这个模式当然能工作，过去两年大部分人也是这样把 agent 用起来的。但越用越会发现，真正消耗人的往往不是那句 prompt 怎么写，而是每一轮都要盯着：它做完没有，偏没偏，结果要不要再喂回去。

这里的 loop 不是简单的自动重试。它更像一条提前设好目标和检查点的任务链：系统知道要找什么工作，把任务交给 agent，检查结果，记录状态，再决定下一轮该做什么。人的位置也跟着变了：不再守在每一轮 prompt 前面盯进度，而是先把这条链路设计清楚。这个判断很有吸引力，也很危险，因为循环一旦跑起来，token、权限、错误和人的判断都会被一起放大。

Peter Steinberger 和 Anthropic 的 Boris Cherny 都把话说到了同一个方向：不要只想着怎样提示 coding agent，而是要设计会提示 agent 的循环。这句话如果只停在口号层面会很空。落到工程里，它真正改变的是人的位置：过去是人拿着 agent，一轮一轮往前推；现在是人先搭一个小系统，让它发现工作、分派工作、检查工作、写下状态，再决定下一步。

Loop engineering 可以放在 agent harness engineering 和 factory model 之上。harness 关心的是单个 agent 在什么环境里跑，能看到什么上下文，能调用什么工具；factory model 关心的是软件怎样被持续生产出来。loop 位于更上一层：它让 harness 按节奏运行，让 agent 被派出去，把状态写到会话之外。它不只是“让 agent 更强”，而是减少 agent 对人类连续喂下一步的依赖。

这里要留意的一点，是这些 loop 的基础件已经不再只是一堆个人脚本。过去要做这种循环，往往要自己写 bash、cron、状态文件和 glue code。现在 Codex App 和 Claude Code 都开始内置相似的能力：自动化、worktree、skills、connectors、sub-agents、外部状态。名字不完全一样，但形状已经接近。工具之争在这里反而退后了，更该设计的是：换一个 agent 产品，这条 loop 还能不能跑起来。

## 五个基础件，还有记忆

一个 loop 可以先拆成五个基础件，再补上一处外部记忆。五个基础件分别是 automations、worktrees、skills、plugins/connectors、sub-agents；第六个不是某个功能按钮，而是 state：Markdown 文件、Linear board、issue 列表，任何能活在单次对话之外、记录已完成和待处理事项的地方。

这层 state 看起来最不起眼，却是长循环能不能接上的关键。模型会忘，单次上下文会结束，线程也可能被切走；如果状态只留在聊天窗口里，下一轮自动化启动时就只能重新猜。把状态写到 repo、任务系统或一份进度文件里，loop 才知道昨天处理到哪里、哪些判断已经被验证、哪些坑不能再踩一次。

| 基础件 | 在 loop 里的职责 | Codex App 侧的对应 | Claude Code 侧的对应 |
| --- | --- | --- | --- |
| Automations | 按节奏发现工作、做 triage、把结果送到人能处理的地方。 | Automations tab、项目和 cadence 配置、triage inbox、`/goal`。 | scheduled tasks、cron、hooks、GitHub Actions、`/loop`、`/goal`。 |
| Worktrees | 让并行 agent 在隔离 checkout 里工作，避免多个 agent 挤在同一个工作目录里改。 | 每个 thread 的内建 worktree 隔离。 | `git worktree`、`--worktree`、subagent 的 worktree isolation。 |
| Skills | 把项目知识、约定和重复做法写成可复用能力。 | `SKILL.md` 形式的 Agent Skills，可显式或隐式触发。 | 同样使用 `SKILL.md`，作为项目知识和流程说明。 |
| Plugins / connectors | 接到 issue tracker、数据库、Slack、staging API 等真实工具。 | MCP connectors 和可分发的 plugins。 | MCP servers 和 plugins。 |
| Sub-agents | 把提出方案的人和检查方案的人分开。 | `.codex/agents/` 里的 TOML subagents。 | `.claude/agents/`、Task subagents、agent teams。 |
| State | 记录完成情况、下一步和前一次尝试的证据。 | Markdown、Linear 或其他 connector 可读写的位置。 | `AGENTS.md`、进度文件、Linear 等外部状态。 |

把这些基础件连起来，loop 才不只是一次长 prompt。没有 automations，人还得每天手动启动；没有 worktrees，并行很快变成同一份工作目录里的冲突；没有 skills，每一轮都要重新解释项目；没有 connectors，系统只能停在本地建议；没有 sub-agents，写代码的人又在给自己判作业；没有 state，第二天又要从零猜起。

## Automations：循环的心跳

Automations 是 loop 开始变成 loop 的地方。一次手动运行只能叫一次任务；有了 cadence，系统才会自己回来，检查新的输入，决定有没有事情值得处理。Codex App 这条路径比较界面化：在 Automations tab 里选择项目、prompt、运行频率和环境；有发现的运行进入 triage inbox，没有发现的运行自动归档。这样一来，日常 CI 失败、issue triage、提交简报、最近引入的 bug，都可以从“人每天想起来查一下”变成“系统每天把值得看的东西推过来”。

这也是为什么 automation 最好调用 skill，而不是把一大段 prompt 固定在定时任务里。定时 prompt 一旦变长，就会变成没人想维护的说明墙；skill 则可以把项目约定、筛选标准、输出格式和验证方式放在一个可版本化的位置。以后规则变了，改 skill，而不是翻出某个隐藏在自动化设置里的 prompt。

Claude Code 也能提供这类心跳，只是入口更分散：scheduled tasks、cron、hooks、GitHub Actions 可以按时间或事件触发任务，`/loop` 偏向按节奏重复，`/goal` 则围绕一个完成条件持续推进。它们不必长在同一个界面里，关键是让 loop 不靠人手动想起来才启动。

`/goal` 这个形态尤其贴近 loop engineering。它不是简单重跑同一个 prompt，而是围绕一个可验证条件继续工作：例如某组测试通过、lint 清理干净、某个检查结果满足条件。更重要的是，完成判断不应该只由刚刚执行任务的同一个 agent 自评。完成条件最好由另一个较小的模型或独立检查过程判断。写的人和判的人分开，loop 的“done”才不至于只是模型对自己工作的一句安慰。

所以 automation 这一节不是在说“定时任务很好用”。它讲的是 loop 的第一层工程化：把发现工作、触发执行、过滤空结果、把值得处理的结果推到人面前这些动作从人的注意力里拿出来。人的角色仍然在，但位置变了：不是每天巡逻，而是看系统推上来的候选项，决定哪些值得进入下一轮。

## Worktrees：并行先隔离工作目录

只要同时跑两个以上的 agent，最先撞上的往往不是模型能力，而是文件系统。两个 agent 改同一个 checkout，和两个工程师没沟通就改同一段代码没有本质区别：最后总有人要收拾冲突，还要判断哪边的上下文被覆盖了。`git worktree` 解决的是这个机械碰撞问题。它给同一个仓库历史开出独立工作目录和独立分支，让一个 agent 的修改不会直接碰到另一个 agent 的 checkout。

Codex App 把这层隔离放进了 thread：几个 thread 可以同时打同一个 repo，但各自落在自己的 worktree 里。Claude Code 的入口更偏 git 侧，可以直接用 `git worktree`，也可以通过 `--worktree` 打开隔离会话，或者在 subagent 上配置 `isolation: worktree`，让每个 agent 拿到新的 checkout，并在结束后清理掉。

这层能力很容易被误读成“并行越多越好”。worktree 只解决工作目录隔离，没有增加人的判断带宽。五个 agent 同时开工，最后仍然可能只有一个人能认真 review；这时瓶颈会从文件冲突变成结果筛选。loop 可以并行产出候选结果，但哪些可信、哪些该合并、哪些要丢掉，仍然需要人判断。

## Skills：把项目约定写下来

Skill 是把项目知识从聊天上下文里拿出来的一种方式。它通常是一个带 `SKILL.md` 的文件夹，里面写清楚这个能力什么时候触发、要遵守什么规则、需要哪些命令或参考资料；旁边还可以放 scripts、references、assets。Codex 可以通过 `$skill-name`、`/skills` 或任务描述自动触发 skill；Claude Code 也使用类似的 `SKILL.md` 形态。这里最重要的不是名字漂亮，而是 description 足够朴素：agent 要能判断什么时候该用它。

这件事和 intent debt 是同一个问题的另一面。每次新会话开始，agent 都是冷启动；项目约定、构建步骤、不能这么做的历史原因，如果只存在人的脑子里，模型就会用自信的猜测填洞。Skill 把这些意图写到对话外面：怎么跑测试、哪些目录不能动、PR 描述要怎么写、遇到某类报错先查哪份文档。loop 每跑一轮都能重新读到这些约定，项目知识才会随着运行次数复利，而不是每次从零推断。

Skill 和 plugin 也要分清。Skill 更像作者写能力的格式，plugin 更像把能力发出去的包装。当一套 skill 要跨 repo 复用，或者要和 connector 一起分发给团队时，就应该被打包成 plugin。对 loop 来说，这个区别很实际：写得好的 skill 让单次运行更稳定，包装好的 plugin 让同一套运行方式能被团队复制。

## Plugins 和 connectors：循环要接入真实工具

只能看文件系统的 loop 很快会碰到边界。日常工作通常散在 issue tracker、数据库、Slack、staging API、CI、Linear ticket 里；agent 如果进不去这些地方，就只能在本地给建议，然后等人把建议搬到真实系统里。Connectors 通过 MCP 把这些工具接进来，让 agent 能读任务、查数据、调用接口、发消息，而不只是修改 repo。

Codex 和 Claude Code 都能走 MCP，这意味着一个 connector 往往不必为两个工具各写一遍。Plugin 则把 connector 和 skill 一起打包：团队成员装一次，就能得到同样的项目规则、同样的外部工具入口、同样的自动化能力。少了这层分发，loop 很容易变成某个人电脑上的私人装置；有了 plugin，它才更像团队工作流。

这里的差别不是“agent 会不会写代码”，而是结果能不能进入真实环境。没有 connector，agent 只能说“这里是修复方案”；有了 connector，loop 才可能开 PR、关联 Linear ticket、在 CI 变绿后通知 Slack，把状态写回看板。循环要自己往前走，就不能只停在代码编辑器里。

## Sub-agents：让写的人和查的人分开

Loop 里最该拆开的角色，是 maker 和 checker。写代码的同一个模型再来判断自己是否写对，风险很高：它容易沿着刚才的思路继续合理化，尤其是在任务长、上下文多、失败不明显的时候。另一个 agent 带着不同指令、甚至不同模型和 reasoning effort 进来检查，才能把第一轮没有看见的问题挑出来。

Codex 的 subagent 默认不会自己冒出来，需要在合适的时候显式调度；它们可以并行执行，最后把结果折回主回答。自定义 subagent 放在 `.codex/agents/`，用 TOML 写 name、description、instructions，也可以指定模型和 reasoning effort。Claude Code 的结构类似，subagent 放在 `.claude/agents/`，还可以组织成 agent teams。常见拆法很朴素：一个 agent 探索问题，一个实现，一个按 spec 和测试做验证。

这层分工在 loop 里尤其重要，因为 loop 往往会在人不盯着的时候运行。能不能放心离开，不取决于第一个 agent 写得多快，而取决于有没有一个足够可靠的 verifier 拦住糟糕结果。代价也真实存在：每多一个 subagent，就多一份模型调用和工具调用。第二意见要花在值得的地方，例如安全、迁移、复杂重构、回归风险高的改动。`/goal` 的完成判断也可以看成同一原则的应用：不要让做事的模型独自宣布 done。

## 一个 loop 看起来会是什么样

把这些组件接起来后，一个 thread 就不只是聊天窗口，而像一个小控制台。可以想象一个很普通的日常 loop：每天早上，automation 在 repo 上跑起来，调用 triage skill，读取昨天的 CI 失败、打开的 issue、最近的 commits，然后把发现写进 Markdown 文件或 Linear board。

每个值得处理的发现，都可以被送进独立 worktree。一个 subagent 先草拟修复方案，另一个 subagent 按项目 skill、已有测试和 spec 复核。这里的关键不是 agent 一次就写对，而是每一步都有明确的外部状态和检查位置：发现在哪里记录，修复在哪里发生，验证结果怎么回流。

Connectors 让 loop 不止停在本地：它可以打开 PR、更新 ticket、在需要人判断的地方把事项送进 triage inbox。状态文件是整条链路的脊柱，它记录试过什么、什么通过了、什么还开着。第二天早上重新启动时，loop 不需要重新猜昨天发生了什么，而是从这个外部状态继续往下走。

人的动作变少了，但人的设计提前发生了。被提前设计的是发现、分派、隔离、验证、回写和升级这一整条路径，而不是其中某一次 prompt。因此比较 Codex App 和 Claude Code 时，重点不该只看某个按钮叫什么，而要看它们能不能把发现、执行、验证和回写这几步稳定接起来。

## Loop 仍然不能替你做什么

Loop 会改变做事方式，但不会把工程师从责任里移走。它越顺，下面几个问题反而越锋利，因为系统开始在无人盯着的时候持续行动。

第一，验证仍然是人的责任。无人值守的 loop 不只是在无人值守地推进任务，也可能在无人值守地制造错误。maker 和 verifier 拆开，可以让“done”这句话更可信，但它仍然只是一个主张，不是证明。最后要交出去的代码，仍然需要有人确认它真的工作。

第二，理解会腐烂得更快。loop 越能快速交付那些不是人亲手写下的代码，代码库和人的理解之间就越容易拉开距离。这就是 comprehension debt：不是代码没有产出，而是产出速度超过了理解速度。要避免这件事，不能只看 CI 绿了没有，还得读 loop 生成了什么、为什么这样改、哪些判断被藏进了自动化流程。

第三，最舒服的姿势也最危险。loop 能自己跑以后，人很容易不再自己判断，只顺手接受它给出的结果。这不是自动化的问题，而是认知让渡的问题。用判断来设计 loop，它是杠杆；用 loop 逃避判断，它会把错误方向加速放大。同一个动作，背后的心态不同，结果完全不同。

## 搭 loop，但别离开工程师的位置

这确实像是 coding agent 工作方式会走向的方向。只是如果不亲自 review 代码，或者完全指望自动 loop 替产品修问题，质量很容易往下滑。系统越能连续行动，错误也越可能连续累积；最后不是省下了判断，而是挖出了更深的坑。

所以应该搭 loop，也仍然应该直接 prompt agent。二者不是互相取代的关系。直接 prompt 适合探索、解释、临场判断；loop 适合定期巡检、固定检查、可验证推进。要找的是平衡：哪些事情交给循环，哪些事情必须停下来由人亲自看。

同一条 loop，放在不同人手里会有完全不同的结果。理解很深的人用它加速已经掌握的工作；不想理解的人用它绕开学习过程。loop 分不出这两种姿态，它只会继续运行。能分出来的人，还是工程师自己。

这也是为什么 loop design 并不比 prompt engineering 更轻松。难点没有消失，只是杠杆点变了：以前难在怎么把这一轮话说清楚，现在难在怎么设计一个会反复说话、反复检查、反复记录状态的系统。

可以搭 loop，但要像一个准备继续负责的人那样搭。否则人只是从“按下一次回车”变成“按下一次启动按钮”，工程判断并没有进步，只是更远地离开了现场。
