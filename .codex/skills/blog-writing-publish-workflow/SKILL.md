---
name: blog-writing-publish-workflow
description: "Use for blog work inside this repository: drafting or revising posts in src/content/posts, source-based reading notes, whole-draft Proof review, ingesting review comments, publishing approved posts through PRs, self-merging clean PRs, and branch cleanup. Do not use for daily news/digest screening automation."
---

# Blog Writing Publish Workflow

## Core Rule

Work from this repository's current files before acting. Read `AGENTS.md` and `docs/writing-guidelines.md` before drafting, revising, reviewing, or publishing a post.

Keep `src/content/posts/` as the source of truth. Treat Proof as a review surface, not as the canonical content store.

## Workflow Router

Choose the matching workflow:

- **Draft or revise a post:** Read `references/writing-workflow.md`, then work section by section unless the user asks for a full-pass edit.
- **Prepare a whole-draft review:** Read `references/writing-workflow.md`, keep the post as a draft, and use Proof only after a full draft exists.
- **Publish an approved post:** Read `references/publish-workflow.md`, verify explicit publish approval, run the repo checks, open a PR, and self-merge only after the PR is clean.
- **Daily digest or news screening:** Stop using this skill. That workflow is separate and should remain outside this skill.

## Operating Constraints

- Keep new posts as `draft: true` until the user explicitly approves publishing.
- Preserve source links for external-material posts, but do not add meta commentary about the writing process.
- Do not commit Proof token URLs, access tokens, owner secrets, review-session state, `dist/`, caches, local env files, or generated outputs.
- Prefer narrow edits to the post, docs, or workflow files named by the task.
- If a source link cannot be accessed, say so and ask for the source material or permission to use another source.

## References

- `references/writing-workflow.md`: writing style, source-based article handling, section-by-section collaboration, Proof review, and comment ingestion.
- `references/publish-workflow.md`: approval gate, verification, PR creation, self-merge, and branch cleanup.
