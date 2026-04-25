import { describe, expect, it } from "vitest";

import { readBuiltPage } from "./helpers/rendered-html";

describe("editorial indexes", () => {
  it("renders shared post rows instead of cards on listing pages", () => {
    const home = readBuiltPage("index.html");
    const archive = readBuiltPage("archives/index.html");
    const tags = readBuiltPage("tags/index.html");
    const astroTag = readBuiltPage("tags/astro/index.html");

    expect(home).toContain('class="post-list post-list--editorial"');
    expect(home).toContain('class="post-row__date"');
    expect(home).not.toContain('class="post-card"');

    expect(archive).toContain('class="archive-page archive-page--editorial"');
    expect(archive).toContain('class="archive-list archive-list--editorial"');

    expect(tags).toContain('class="tags-page tags-page--editorial"');
    expect(tags).toContain('class="tags-grid tags-grid--editorial"');

    expect(astroTag).toContain('class="tag-page tag-page--editorial"');
    expect(astroTag).toContain('class="post-list post-list--editorial"');
  });
});
