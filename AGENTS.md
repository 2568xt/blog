# Agent Instructions for 2568xt Blog

## Language

- Answer in Chinese by default unless the user explicitly asks for English.
- For repository-specific questions, inspect the source before explaining.

## Project Overview

- This is a personal technical blog built with Astro.
- The expected public site is `https://2568xt.github.io/blog/`.
- The stack is Astro, Content Collections, Markdown/MDX, Vitest, and GitHub Pages.
- Published posts live in `src/content/posts/`.

## Content Model

Post frontmatter follows this shape:

```yaml
title: string
date: string
summary: string
tags: string[]
draft?: boolean
cover?: string
```

Keep summaries concise and useful for listing pages and RSS.

## Writing Style

- Before drafting or revising a post, consult `docs/writing-guidelines.md` for the detailed writing workflow and style rules.
- Default blog posts should use a personal retrospective style.
- Prefer explaining why a change was made, what tradeoffs appeared, what went wrong, and what should be done differently next time.
- Avoid generic tutorial voice unless the user explicitly asks for a step-by-step beginner guide.
- Keep the writing concrete and grounded in the actual project, commands, errors, and decisions.
- Keep reference links when a post is based on external material.
- Do not include meta commentary that is unrelated to the topic, such as saying the post is not a literal translation, was rewritten for Chinese readers, or was generated from another writing process.
- Avoid first-person `我` in posts; use `笔者` or an objective sentence structure instead.

## Collaboration Workflow

- When drafting or revising posts, discuss the work with the user section by section instead of producing a full final draft in one pass.
- Confirm the topic, outline, and major sections incrementally; incorporate user feedback before moving to the next block.
- If a user-provided source link cannot be accessed directly, report that immediately and ask the user whether to provide the material or approve alternate sources. Do not silently substitute cached pages, reposts, summaries, or search results.
- When the user introduces a new recurring norm or workflow preference, ask whether it should be recorded in `AGENTS.md` or a separate project document.

## Publishing Workflow

- New posts should default to `draft: true`.
- Do not publish a new post unless the user explicitly approves it.
- After user approval, remove `draft: true` or set `draft: false`, then run the relevant checks and build before publishing.
- After a PR is merged, delete the corresponding remote branch and any fully merged local branch. If a local branch contains unmerged commits, do not force-delete it; report the extra commits first and preserve the work.

## Common Commands

- Install dependencies: `npm install`
- Start local dev server: `npm run dev`
- Run tests: `npm test`
- Run Astro checks: `npm run check`
- Build static site: `npm run build`
- Preview built site: `npm run preview`

## Repository Layout

- `src/content/posts/`: blog posts.
- `src/content.config.ts`: content collection definition.
- `src/content/schema.ts`: post frontmatter schema.
- `src/pages/`: Astro routes.
- `src/layouts/`: page layouts.
- `src/components/`: reusable UI components.
- `src/lib/`: post processing and routing helpers.
- `tests/`: Vitest coverage for content, routing, and rendered HTML.
- `.github/workflows/deploy.yml`: GitHub Pages deployment.

## Editing Rules

- Keep changes narrow and avoid unrelated refactors.
- Preserve user changes in the working tree.
- Do not commit generated outputs, caches, local environment files, datasets, checkpoints, or secrets.
- Do not commit `dist/`.
- Prefer `rg` or `rg --files` for repository search.
- Use existing Astro/content patterns before adding new abstractions.

## Task Completion

- After each independent task is complete, create a git commit by default unless the user explicitly asks not to.
- Before committing, review the changed files and summarize the verification that was run or why it was skipped.
- Keep commits scoped to the completed task; do not include unrelated local changes or generated outputs.

## Verification

- For content-only changes, run `npm run check` and `npm run build` when practical.
- For behavior, routing, layout, or helper changes, also run `npm test`.
- If a test fails because of a pre-existing unrelated local change, state that clearly and do not silently rewrite the unrelated change.

## Deployment

- Deployment is handled by GitHub Pages through `.github/workflows/deploy.yml`.
- Pushing to `main` triggers the deploy workflow.
