import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it, vi } from "vitest";

import {
  createProofShare,
  deriveProofTitle,
  ProofReviewError,
  resolvePostPath,
} from "../scripts/proof-review.mjs";

function createTempRepo() {
  const repoRoot = mkdtempSync(join(tmpdir(), "blog-proof-review-"));
  const postsDir = join(repoRoot, "src", "content", "posts");
  mkdirSync(postsDir, { recursive: true });
  return { repoRoot, postsDir };
}

describe("resolvePostPath", () => {
  it("resolves a post slug to a markdown file", async () => {
    const { repoRoot, postsDir } = createTempRepo();
    const postPath = join(postsDir, "example.md");
    writeFileSync(postPath, "---\ntitle: Example\n---\n\nBody\n");

    await expect(resolvePostPath("example", { repoRoot })).resolves.toBe(
      postPath,
    );
  });

  it("resolves a repo-relative mdx post path", async () => {
    const { repoRoot, postsDir } = createTempRepo();
    const postPath = join(postsDir, "example.mdx");
    writeFileSync(postPath, "---\ntitle: Example\n---\n\n<Note />\n");

    await expect(
      resolvePostPath("src/content/posts/example.mdx", { repoRoot }),
    ).resolves.toBe(postPath);
  });

  it("rejects files outside the posts directory", async () => {
    const { repoRoot } = createTempRepo();
    writeFileSync(join(repoRoot, "README.md"), "# Not a post\n");

    await expect(resolvePostPath("README.md", { repoRoot })).rejects.toThrow(
      "src/content/posts",
    );
  });

  it("reports a missing draft post", async () => {
    const { repoRoot } = createTempRepo();

    await expect(resolvePostPath("missing-post", { repoRoot })).rejects.toThrow(
      "Could not find draft post",
    );
  });
});

describe("deriveProofTitle", () => {
  it("uses the frontmatter title when present", () => {
    const markdown = '---\ntitle: "Loop Engineering：把提示词交给循环"\n---\n\nBody\n';

    expect(
      deriveProofTitle(markdown, "/repo/src/content/posts/loop-engineering-cn.md"),
    ).toBe("Loop Engineering：把提示词交给循环");
  });

  it("falls back to the filename when frontmatter has no title", () => {
    expect(deriveProofTitle("No frontmatter", "/repo/src/content/posts/note.md")).toBe(
      "note",
    );
  });
});

describe("createProofShare", () => {
  it("posts markdown to Proof and returns the response payload", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          tokenUrl: "https://proof.test/d/doc",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const result = await createProofShare({
      title: "Draft",
      markdown: "# Draft\n",
      endpoint: "https://proof.test/share",
      fetchImpl,
    });

    expect(result.tokenUrl).toBe("https://proof.test/d/doc");
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://proof.test/share",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Draft", markdown: "# Draft\n" }),
      }),
    );
  });

  it("fails when Proof does not return a token URL", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ slug: "doc" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(
      createProofShare({
        title: "Draft",
        markdown: "# Draft\n",
        fetchImpl,
      }),
    ).rejects.toThrow(ProofReviewError);
  });

  it("surfaces non-OK Proof responses", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response("nope", { status: 500 }),
    );

    await expect(
      createProofShare({
        title: "Draft",
        markdown: "# Draft\n",
        fetchImpl,
      }),
    ).rejects.toThrow("HTTP 500");
  });
});
