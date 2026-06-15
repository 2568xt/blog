# Publish Workflow

Use this reference only after the user explicitly approves publishing a post.

## Approval Gate

Publishing means removing `draft: true` or setting `draft: false` on a post. Do not do that until the user has clearly approved publication.

If the user only asks for review, editing, Proof, or "ready soon," keep the post as a draft.

## Pre-Publish Checks

Before opening a publish PR:

- Confirm the changed post has the expected title, date, summary, tags, and source links.
- Confirm no Proof token URL, owner secret, review state, generated output, cache, local env file, or `dist/` file is staged.
- Run `npm run check` and `npm run build` for content-only publication.
- Run `npm test` as well when publishing work includes route, layout, content helper, package script, or test changes.

If a check fails, fix the failure before creating or merging the PR unless the user explicitly redirects.

## PR Flow

Publish through a pull request unless the user explicitly asks for direct push to `main`.

After checks pass:

1. Commit the scoped changes.
2. Push the branch.
3. Open a PR with a concise description of the post or workflow change and the verification results.
4. Wait for required PR checks when they exist.
5. If the PR scope is clean and checks pass, merge it without asking the user to manually review the PR.

This self-merge rule does not remove the publish approval gate. Approval happens before removing the draft flag; self-merge happens after the PR is ready.

## After Merge

After the PR is merged:

- Delete the remote branch.
- Delete the local branch only if it is fully merged or patch-equivalent.
- If local commits appear unmerged, preserve the branch and report the extra commits instead of force-deleting.
- Return to `main` and sync it with the remote when practical.
