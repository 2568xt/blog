import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const cssPath = resolve(import.meta.dirname, "..", "src", "styles", "global.css");

describe("quiet product CSS system", () => {
  it("defines the dark product token system and responsive hooks", () => {
    const css = readFileSync(cssPath, "utf8");

    expect(css).toContain("color-scheme: dark;");
    expect(css).toContain("--bg: #0c0f15;");
    expect(css).toContain("--surface: #151a23;");
    expect(css).toContain("--text: #f4f1ea;");
    expect(css).toContain("--accent: #f0a94a;");
    expect(css).toContain("body.quiet-product-theme");
    expect(css).toContain(".prose--quiet-product a");
    expect(css).toContain("text-underline-offset");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("@media (max-width: 760px)");
    expect(css).not.toContain("--bg: #f3ede4");
    expect(css).not.toContain("Iowan Old Style");
  });
});
