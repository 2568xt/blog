# Quiet Product Blog Redesign

Date: 2026-04-29
Status: Proposed
Project: `2568xt Blog`

## 1. Goal

Redesign the full Astro blog into a darker, quieter, product-influenced personal writing site.

The site should feel more like a finished product surface than a traditional editorial blog, but it must remain writing-first. The homepage should lead with the article stream, the post page should prioritize long-form reading, and supporting indexes should be structured without becoming dashboards.

## 2. Confirmed Direction

The approved direction is `Quiet Product`.

User-selected inputs:

- Site type: personal writing site
- Visual reference family: Stripe / Raycast, with more polished product structure
- Homepage structure: `Signal Stream`, meaning a short intro followed directly by posts
- Palette direction: `Dark Signal`, meaning dark UI with restrained warm accents
- Post page layout: `Reading First`, meaning the article remains the primary surface

This design should not become a portfolio, marketing page, or research archive. It should stay a personal blog with a sharper product-design vocabulary.

## 3. Current State

The current implementation uses an `editorial` visual language:

- Warm paper-like light background
- Serif-led large titles
- Thin separators and quiet metadata
- List-based homepage and archive indexes
- Sticky header and reading page with a side table of contents

This is readable and coherent, but the requested redesign should move away from the Anthropic/editorial mood toward a darker product interface while preserving the site's simple information architecture.

## 4. Scope

In scope:

- Global header and footer
- Homepage
- Shared post list component
- Post detail pages
- Table of contents styling
- Previous/next article navigation
- Archive page
- Tag index page
- Single tag pages
- Global color, typography, spacing, borders, responsive behavior, and focus/hover states
- Tests that currently assert the old `editorial` structure

Out of scope:

- New routes
- Search, filtering, pagination, comments, analytics, authentication, or CMS features
- New content model fields
- Featured-post curation
- Portfolio or project sections
- Large animation systems
- External UI framework adoption

## 5. Information Architecture

The existing IA remains intact:

- `/` is the homepage and latest writing stream
- `/posts/[slug]/` is the long-form post page
- `/archives/` groups posts by year
- `/tags/` lists all tags
- `/tags/[tag]/` lists posts for a single tag
- RSS remains available from navigation

The redesign is structural and visual, not functional. It should not add new site modes or change publishing behavior.

## 6. Design System

### 6.1 Palette

Use a dark, quiet product palette with one warm signal accent.

- Page background: near-black blue-gray, around `#0c0f15`
- Surface background: dark elevated panel, around `#151a23`
- Softer surface: subtle inset areas, around `#1b212c`
- Primary text: warm off-white, around `#f4f1ea`
- Secondary text: muted cool gray, around `#a9b0bc`
- Muted text: lower-contrast gray, around `#6f7785`
- Border: translucent blue-gray, low contrast
- Accent: warm signal amber, around `#f0a94a`
- Code background: slightly cooler dark panel distinct from the page background

The accent should be used for links, focus states, selected metadata, blockquote edges, and small signal details. It should not dominate the page.

### 6.2 Typography

Replace the current serif-forward editorial voice with a modern product typography stack.

- Use a sans-serif stack for headings, navigation, metadata, and body text
- Keep monospace for code
- Preserve comfortable long-form reading with generous line height
- Avoid oversized marketing-style hero text
- Keep Chinese text legible by using spacing, rhythm, and contrast rather than decorative type choices

The site should feel precise and polished, not ornamental.

### 6.3 Spacing

Use an 8px-based spacing system.

- Small component gaps: `8px` / `12px`
- Row and module spacing: `16px` / `24px`
- Page section spacing: `48px` / `64px`
- Large top breathing room only where it improves scanning

The homepage should show posts in the first viewport. The intro must stay short.

### 6.4 Radius, Borders, and Depth

Use restrained product surfaces.

- Module radius: `10px` to `14px`
- Tags and small controls: pill radius
- Borders: thin, translucent, and consistent
- Shadows: minimal or absent
- Depth should come from borders, subtle surfaces, and occasional inner highlights

Avoid large rounded cards, heavy glows, decorative blobs, and full-page gradient spectacle.

### 6.5 Motion

Motion should be lightweight and functional.

- Link, nav, tag, and row transitions: `160ms` to `220ms`
- Use subtle background, border, or color changes
- Respect `prefers-reduced-motion`
- No large entrance animations or scroll-driven effects

## 7. Page Designs

### 7.1 Global Header

The header becomes a compact product-style navigation bar.

- Keep the current nav items: 首页, 归档, 标签, RSS
- Use a dark translucent sticky header with a thin bottom border
- Brand remains text-led
- Tagline is optional, but if kept, it should be compact and muted
- Nav links should feel like quiet controls rather than editorial links
- Focus states must be visible, using the warm accent

### 7.2 Homepage

The homepage follows the approved `Signal Stream` structure.

Content order:

1. Short intro band with site title and concise description
2. Small metadata row, such as post count and archive/RSS entry points
3. Latest writing stream

Design requirements:

- No large hero module
- No featured article block
- No promotional sections
- The first viewport should reveal article rows
- Article rows use date, title, summary, and tags
- Hover treatment should be subtle: border/background/text color shift only

### 7.3 Shared Post List

`PostList.astro` remains the shared listing component for homepage and single-tag pages.

Desktop layout:

- Left column: date metadata
- Right column: title, summary, tags
- Rows separated by thin borders
- Row rhythm should be dense enough for scanning but not cramped

Mobile layout:

- Collapse date above or near title
- Preserve clear title hierarchy
- Tags wrap naturally without causing layout shifts

### 7.4 Post Page

Post pages follow the approved `Reading First` layout.

Design requirements:

- Header area contains essay label, date, slug or id, title, summary, and tags
- The title uses modern sans-serif scale, not serif editorial display
- Reading column remains the dominant element
- Table of contents is secondary and quiet
- Previous/next navigation remains text-led

Content styles:

- Body text should have strong contrast and comfortable line height
- `h2` / `h3` should create clear article rhythm
- Code blocks use a dark code surface with clear border and horizontal overflow
- Inline code is visible but not loud
- Blockquotes use the warm accent sparingly
- Tables should remain readable on narrow screens
- Inline notes must fit the same product surface language

### 7.5 Table of Contents

The table of contents stays available on post pages, but should not feel like a dashboard widget.

- Use sticky placement on wide screens
- Use a thin border or soft surface treatment
- Keep typography small and muted
- Depth-3 headings should be visually subordinate
- On smaller screens, it can flow below the hero or collapse into a simple block, depending on the least disruptive implementation

### 7.6 Archive Page

Archive remains a year-grouped writing index.

Design requirements:

- Year groups should feel like a product changelog or system log, but not a database table
- Keep date/title scan path strong
- Use row separators and subtle metadata
- Preserve the current content and grouping behavior

### 7.7 Tags Pages

Tag index:

- Present tags as quiet pill controls with counts
- Keep the page compact and navigational
- Avoid statistics dashboards or charts

Single tag page:

- Reuse the shared post stream
- Header should identify the selected tag and post count
- No extra filtering UI

### 7.8 Footer

Footer remains minimal.

- Keep site description and Astro publishing note
- Use low-contrast text and top border
- Do not add extra columns or promotional content

## 8. Responsive Behavior

Responsive behavior is part of the core design.

- Minimum viewport: 320px
- Header must wrap or compress cleanly without overlapping
- Homepage rows collapse to one column on mobile
- Post page side content must not squeeze the article
- Code blocks must scroll horizontally instead of breaking layout
- Tags and metadata must wrap with stable spacing
- Text must not overflow buttons, pills, or rows

## 9. Accessibility

The redesign should preserve and improve accessibility.

- Maintain semantic headings and landmarks
- Keep visible keyboard focus states
- Preserve sufficient color contrast for body text, links, and metadata
- Do not rely on color alone for navigation state
- Respect reduced-motion preference
- Keep touch targets practical on mobile

## 10. Implementation Boundaries

Expected primary files:

- `src/styles/global.css`
- `src/layouts/BaseLayout.astro`
- `src/components/PostList.astro`
- `src/components/TagPill.astro`
- `src/components/TableOfContents.astro`
- `src/components/InlineNote.astro`
- `src/pages/index.astro`
- `src/pages/posts/[slug].astro`
- `src/pages/archives/index.astro`
- `src/pages/tags/index.astro`
- `src/pages/tags/[tag].astro`
- `tests/editorial-shell.test.ts`
- `tests/editorial-indexes.test.ts`
- `tests/editorial-post-page.test.ts`

The implementation should prefer cohesive class and token updates over ad hoc page-specific overrides. It may rename `editorial` classes to a new `quiet-product` naming scheme if tests and templates are updated consistently.

## 11. Testing and Verification

Required checks after implementation:

- `npm test`
- `npm run check`
- `npm run build`
- Browser review of homepage, post page, archive page, tag index, and single-tag page
- Responsive review at desktop and mobile widths

Visual verification should specifically check:

- Homepage shows article rows in the first viewport
- Post page remains comfortable to read
- Header and nav do not overlap on mobile
- Code blocks and tables do not overflow the page
- Tags and metadata wrap cleanly
- The palette reads as dark product UI with a warm signal accent, not a one-note dark-blue theme

## 12. Risks and Mitigations

### Risk: The site becomes too dashboard-like

Mitigation: Keep homepage and post page content-first. Use product details for structure, not for extra panels.

### Risk: Dark mode hurts long-form readability

Mitigation: Use warm off-white text, careful line height, restrained contrast for metadata, and direct browser review of real posts.

### Risk: The redesign feels too close to generic AI dark UI

Mitigation: Avoid purple gradients, oversized glowing cards, fake metrics, icon spam, and decorative blobs. The differentiator should be precise layout and warm signal details.

### Risk: Existing tests lock the old visual naming

Mitigation: Update tests to assert the new shared structure and `quiet-product` classes rather than old `editorial` markers.
