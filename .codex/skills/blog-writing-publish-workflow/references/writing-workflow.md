# Writing And Proof Review Workflow

Use this reference when drafting, revising, translating, adapting, or reviewing a blog post in this repository.

## Before Writing

Read `AGENTS.md` and `docs/writing-guidelines.md`. Inspect existing posts in `src/content/posts/` when tone, frontmatter, or structure is uncertain.

For a new post:

- Put the file under `src/content/posts/`.
- Add `draft: true` by default.
- Keep `summary` concise enough for listing pages and RSS.
- Keep tags accurate and restrained.

If the post is based on external material:

- Verify the source link is accessible before relying on it.
- Keep the source link for reader lookup.
- Cover the source structure and paragraph progression unless the user explicitly asks for a different structure.
- Translate, rewrite, or merge paragraphs as needed, but keep every major source paragraph represented in Chinese.
- Avoid repeated paragraph subjects like `原文`, `作者`, or `文章` once the source link has already been given.
- Do not add process meta such as "this is not a literal translation" or "rewritten for Chinese readers."

## Voice

Write like a personal technical essay, not a report or generic tutorial.

- Open with a concrete engineering or everyday example when the topic allows it.
- Prefer concrete commands, errors, paths, decisions, failure modes, and tradeoffs over generic claims.
- Avoid first-person `我`; use `笔者` sparingly or rewrite into objective phrasing.
- Use tables when two or more options, stages, systems, or tradeoffs need comparison.
- Let the ending land on a boundary, tradeoff, failure mode, or operational judgment instead of a template takeaway.

## Collaboration

Move section by section for drafting and major revision:

1. Confirm the topic, reader, and thesis.
2. Confirm the outline or source-structure mapping.
3. Draft or revise one section at a time.
4. Incorporate user feedback before moving to the next section.

If the user asks for a full-pass rewrite or translation, do the full pass, but still preserve the repo style and source-structure rules.

## Proof Review

Use Proof for whole-draft review after a full draft exists. Do not launch Proof for early outline or single-section work unless the user asks.

To start review, use the repo script:

```bash
npm run proof:review -- <slug-or-repo-relative-post-path>
```

Then share the returned Proof URL with the user. Do not write that URL or any Proof token/secret into tracked files.

When comments are available:

- Read and group Proof comment threads by the affected section.
- Apply accepted edits back to the local Markdown file under `src/content/posts/`.
- Reply in Proof when a thread has been handled if the available tool supports it.
- Keep unresolved or rejected suggestions visible in the final response.
- Treat the local Markdown file as canonical after sync.

## Verification

For content-only changes, run `npm run check` and `npm run build` when practical. If the change touches routing, rendering, helpers, package scripts, or tests, also run `npm test`.
