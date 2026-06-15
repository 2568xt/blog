#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DEFAULT_PROOF_ENDPOINT = "https://www.proofeditor.ai/share/markdown";
const POST_EXTENSIONS = new Set([".md", ".mdx"]);

export class ProofReviewError extends Error {
  constructor(message) {
    super(message);
    this.name = "ProofReviewError";
  }
}

function isInside(childPath, parentPath) {
  const relativePath = path.relative(parentPath, childPath);
  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !path.isAbsolute(relativePath))
  );
}

function uniquePaths(paths) {
  return [...new Set(paths.map((candidate) => path.normalize(candidate)))];
}

export async function resolvePostPath(input, options = {}) {
  const repoRoot = options.repoRoot ?? process.cwd();
  const postsDir =
    options.postsDir ?? path.resolve(repoRoot, "src", "content", "posts");
  const trimmedInput = input?.trim();

  if (!trimmedInput) {
    throw new ProofReviewError(
      "Pass a draft slug or a repo-relative path under src/content/posts/.",
    );
  }

  const inputExt = path.extname(trimmedInput);
  const looksLikePath =
    path.isAbsolute(trimmedInput) ||
    trimmedInput.startsWith(".") ||
    trimmedInput.startsWith("src/") ||
    trimmedInput.includes(path.sep) ||
    trimmedInput.includes("/");

  const candidates = [];

  if (inputExt) {
    if (path.isAbsolute(trimmedInput)) {
      candidates.push(trimmedInput);
    } else {
      const repoRelativePath = path.resolve(repoRoot, trimmedInput);
      candidates.push(
        !looksLikePath && !existsSync(repoRelativePath)
          ? path.resolve(postsDir, trimmedInput)
          : repoRelativePath,
      );
    }
  } else if (looksLikePath) {
    const basePath = path.isAbsolute(trimmedInput)
      ? trimmedInput
      : trimmedInput.startsWith("src/")
        ? path.resolve(repoRoot, trimmedInput)
        : path.resolve(postsDir, trimmedInput);
    candidates.push(`${basePath}.md`, `${basePath}.mdx`);
  } else {
    candidates.push(
      path.resolve(postsDir, `${trimmedInput}.md`),
      path.resolve(postsDir, `${trimmedInput}.mdx`),
    );
  }

  for (const candidate of uniquePaths(candidates)) {
    if (!isInside(candidate, postsDir)) {
      throw new ProofReviewError(
        "Proof review only accepts files under src/content/posts/.",
      );
    }

    if (!POST_EXTENSIONS.has(path.extname(candidate))) {
      throw new ProofReviewError(
        "Proof review only accepts Markdown or MDX posts.",
      );
    }

    if (!existsSync(candidate)) {
      continue;
    }

    const candidateStat = await stat(candidate);
    if (candidateStat.isFile()) {
      return candidate;
    }
  }

  throw new ProofReviewError(`Could not find draft post: ${trimmedInput}`);
}

export function deriveProofTitle(markdown, filePath) {
  const fallback = path.basename(filePath, path.extname(filePath));
  const frontmatterMatch = markdown.match(
    /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/,
  );

  if (!frontmatterMatch) {
    return fallback;
  }

  const titleLine = frontmatterMatch[1]
    .split(/\r?\n/)
    .find((line) => line.trimStart().startsWith("title:"));

  if (!titleLine) {
    return fallback;
  }

  const rawTitle = titleLine.slice(titleLine.indexOf(":") + 1).trim();
  const quotedTitle = rawTitle.match(/^["'](.*)["']$/);
  return (quotedTitle ? quotedTitle[1] : rawTitle) || fallback;
}

export async function createProofShare({
  title,
  markdown,
  endpoint = DEFAULT_PROOF_ENDPOINT,
  fetchImpl = fetch,
}) {
  const response = await fetchImpl(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, markdown }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const details = body ? `: ${body}` : "";
    throw new ProofReviewError(
      `Proof share failed with HTTP ${response.status}${details}`,
    );
  }

  const payload = await response.json().catch(() => {
    throw new ProofReviewError("Proof share returned invalid JSON.");
  });

  if (!payload?.tokenUrl) {
    throw new ProofReviewError("Proof share response did not include tokenUrl.");
  }

  return payload;
}

function openUrl(url) {
  const opener =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "cmd"
        : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  const child = spawn(opener, args, { detached: true, stdio: "ignore" });
  child.unref();
}

function parseArgs(argv) {
  const options = {
    open: false,
    endpoint: process.env.PROOF_SHARE_ENDPOINT ?? DEFAULT_PROOF_ENDPOINT,
  };
  const inputs = [];

  for (const arg of argv) {
    if (arg === "--open") {
      options.open = true;
    } else if (arg.startsWith("--endpoint=")) {
      options.endpoint = arg.slice("--endpoint=".length);
    } else {
      inputs.push(arg);
    }
  }

  return { input: inputs[0], options };
}

export async function run(argv = process.argv.slice(2), options = {}) {
  const { input, options: cliOptions } = parseArgs(argv);
  const repoRoot = options.repoRoot ?? process.cwd();
  const postPath = await resolvePostPath(input, { repoRoot });
  const markdown = await readFile(postPath, "utf8");
  const title = deriveProofTitle(markdown, postPath);
  const proofDoc = await createProofShare({
    title,
    markdown,
    endpoint: cliOptions.endpoint,
    fetchImpl: options.fetchImpl ?? fetch,
  });

  if (cliOptions.open) {
    openUrl(proofDoc.tokenUrl);
  }

  return { postPath, title, proofDoc };
}

async function main() {
  try {
    const result = await run();
    console.log(`Proof review URL: ${result.proofDoc.tokenUrl}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Proof review failed: ${message}`);
    process.exitCode = 1;
  }
}

if (
  import.meta.url ===
  pathToFileURL(process.argv[1] ?? fileURLToPath(import.meta.url)).href
) {
  await main();
}
