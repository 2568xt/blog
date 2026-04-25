import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const repoRoot = resolve(import.meta.dirname, "..", "..");
const distRoot = resolve(repoRoot, "dist");

let built = false;

export function ensureBuild() {
  if (built) {
    return;
  }

  execSync("npm run build", {
    cwd: repoRoot,
    stdio: "pipe",
  });

  built = true;
}

export function readBuiltPage(relativePath: string) {
  ensureBuild();

  const fullPath = resolve(distRoot, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Built page not found: ${relativePath}`);
  }

  return readFileSync(fullPath, "utf8");
}
