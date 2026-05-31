import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const cssPath = resolve(import.meta.dirname, "..", "src", "styles", "global.css");

describe("quiet product CSS system", () => {
  it("defines the light product token system and responsive hooks", () => {
    const css = readFileSync(cssPath, "utf8");

    expect(css).toContain("color-scheme: light;");
    expect(css).toContain("--bg: #f3ede4;");
    expect(css).toContain("--surface: #fffdf9;");
    expect(css).toContain("--text: #1f1a17;");
    expect(css).toContain("--accent: #7a5b33;");
    expect(css).toContain("body.quiet-product-theme");
    expect(css).toContain(".prose--quiet-product a");
    expect(css).toContain("text-underline-offset");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("@media (max-width: 760px)");
    expect(css).not.toContain("--bg: #0c0f15");
    expect(css).not.toContain("Iowan Old Style");
  });
});
