import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { ensureBuild, readBuiltPage } from "./helpers/rendered-html";

const distRoot = resolve(import.meta.dirname, "..", "dist");
const draftTitle = "不会进入生产环境的草稿";

describe("draft publication guard", () => {
  it("does not generate a public post route for draft content", () => {
    ensureBuild();

    expect(existsSync(resolve(distRoot, "posts", "draft-hidden", "index.html"))).toBe(
      false,
    );
  });

  it("keeps draft posts out of public indexes and feeds", () => {
    const home = readBuiltPage("index.html");
    const archive = readBuiltPage("archives/index.html");
    const tags = readBuiltPage("tags/index.html");
    const rss = readBuiltPage("rss.xml");

    for (const html of [home, archive, tags, rss]) {
      expect(html).not.toContain(draftTitle);
    }
  });

  it("does not generate tag routes that only belong to drafts", () => {
    ensureBuild();

    expect(existsSync(resolve(distRoot, "tags", "draft", "index.html"))).toBe(
      false,
    );
  });
});
