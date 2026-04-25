# Anthropic-Style Blog Redesign

Date: 2026-04-26
Status: Proposed
Project: `2568xt Blog`

## 1. Goal

Redesign the existing Astro blog so it feels closer to Anthropic's editorial aesthetic while preserving the current information architecture.

The finished site should read as a calm, publication-style writing space rather than a dark technical UI with cards. The redesign is visual and structural, not functional. Content collections, routes, and publishing workflow stay intact.

## 2. Current State

The current blog is a dark, minimal technical blog built with Astro. Its main traits:

- Deep dark palette with cool blue accents
- Strong card treatment on the homepage and supporting surfaces
- Sticky product-like header and footer
- Article lists presented as cards rather than editorial indexes
- Long-form reading pages that still inherit some UI-panel styling

This works, but it does not match the requested direction of "fully Anthropic-like" visual tone.

## 3. Design Direction

The redesign will follow an editorial, restrained, Anthropic-adjacent visual system:

- Warm off-white paper-like backgrounds instead of dark surfaces
- Charcoal text instead of pure black
- Very light borders used sparingly
- Visual hierarchy built through typography, spacing, line length, and rhythm rather than cards and shadows
- A calmer, more publication-like tone across all pages

This should feel close to Anthropic's taste without turning the blog into a corporate marketing site.

## 4. Scope

In scope:

- Homepage
- Post list presentation
- Post page header and reading layout
- Table of contents styling and placement treatment
- Archive page
- Tag index page
- Single tag page
- Global header and footer
- Global color, typography, spacing, borders, and responsive behavior

Out of scope:

- Content model changes
- Route changes
- New interactive features
- New animations beyond subtle hover and focus states
- CMS, search, filters, pagination, or other functional additions
- Converting the site into a hero-led landing page

## 5. Information Architecture

The existing structure remains intact.

### Homepage

The homepage keeps its current composition:

1. Site title
2. Short introduction
3. Latest posts list

No extra hero modules, featured carousels, or marketing sections will be added.

### Article Pages

Article pages keep:

- Title
- Date and metadata
- Summary
- Tags
- Table of contents
- Article body
- Previous/next navigation

The redesign changes presentation, not content structure.

### Archive and Tag Pages

Archive and tag pages continue to act as navigational indexes, but they will adopt the same editorial language as the homepage and article pages.

## 6. Visual System

### Palette

Replace the current dark blue palette with a warm editorial palette:

- Background: warm off-white / light paper tone
- Secondary background: subtle cream or near-white panels only when needed
- Primary text: dark charcoal
- Secondary text: muted brown-gray
- Borders: soft, low-contrast warm gray
- Accent: restrained, low-saturation brown or bronze-like emphasis

The accent color should support links and small highlights, not dominate the interface.

### Typography

Typography becomes the primary design tool.

- Major headings and post titles: serif-leaning editorial tone
- Navigation, metadata, labels, and body text: clean sans-serif
- Larger, calmer title scale on homepage and post pages
- Narrower, more deliberate body measure on article pages
- Stronger spacing rhythm between heading, deck, metadata, and content blocks

For Chinese content, "editorial feeling" should come from hierarchy, spacing, and texture, not from forcing an overly decorative serif voice everywhere.

### Surfaces

The redesign should remove most explicit card styling:

- Eliminate heavy shadows
- Reduce radius to a restrained level
- Prefer separators and whitespace over enclosed blocks
- Use framed boxes only when there is a real structural reason, such as code blocks, notes, or limited utility sections

## 7. Page-by-Page Design

### 7.1 Global Header

The header should become lighter and less product-like:

- Keep primary navigation
- Reduce visual weight of the sticky bar
- Use lighter borders and more breathing room
- Make it feel like a publication masthead rather than an app navbar

### 7.2 Homepage Intro

The intro should feel like the opening of a publication:

- Larger site title
- Controlled text width for the description
- More generous spacing above and below
- Minimal decorative treatment

### 7.3 Post List

The current card list will be replaced by an editorial list:

- Date placed in a dedicated leading column on larger screens
- Title becomes the first visual anchor
- Summary sits beneath the title in smaller, softer text
- Tags appear as quiet metadata, not colorful chips
- Each row separated by a thin divider

This is the central change that shifts the homepage from "UI cards" to "editorial index."

### 7.4 Post Page

The post page should read like a serious long-form article:

- Strong editorial title block
- Softer metadata and tag treatment
- Narrower reading column
- Better rhythm for headings, paragraphs, blockquotes, and code blocks
- TOC visually reduced so it supports navigation without looking like a dashboard widget

### 7.5 Previous/Next Navigation

Previous and next links should move away from card treatment:

- Simpler text-led navigation
- Thin separators and restrained emphasis
- Clear directional labeling without heavy framing

### 7.6 Archive and Tag Pages

These pages should become clean indexes:

- Strong headings
- Clear grouping
- Minimal chrome
- Consistent row rhythm with the homepage list treatment

### 7.7 Footer

The footer should feel like a publication footer:

- Less bulky
- Less product language
- Calm, low-contrast supporting text
- Consistent with the rest of the editorial system

## 8. Responsive Behavior

Responsive behavior is part of the redesign, not a follow-up.

- On small screens, the two-column date/content list should collapse naturally into a single-column flow
- Navigation should remain simple and not overcrowd the header
- Heading sizes must scale down enough to preserve hierarchy without becoming oversized
- Metadata, tags, and auxiliary elements must not collide or wrap awkwardly
- Reading width on mobile should remain comfortable for Chinese text and code blocks

## 9. Implementation Plan Boundaries

The redesign should stay within the existing Astro architecture. No new UI framework is needed.

Primary files expected to change:

- `src/styles/global.css`
- `src/layouts/BaseLayout.astro`
- `src/components/PostList.astro`
- Supporting page templates for posts, archives, tags, and related layout classes

The implementation should prefer focused structural updates and a unified CSS rewrite over scattered local tweaks.

## 10. Risks and Mitigations

### Risk 1: It only looks like a lighter version of the current site

Mitigation:

- Remove card-first composition
- Rebuild the list rhythm and page spacing
- Let typography and layout carry the redesign

### Risk 2: It imitates Anthropic too literally and feels wrong for a technical blog

Mitigation:

- Preserve the blog's information architecture
- Keep code blocks, tables, metadata, and tags practical
- Use Anthropic as an aesthetic reference, not as a branding template

### Risk 3: Readability drops because the palette becomes too soft

Mitigation:

- Keep strong contrast for body text
- Maintain clear distinction between primary, secondary, and tertiary text
- Verify long-form reading pages directly in browser

### Risk 4: Chinese typography feels forced

Mitigation:

- Use serif emphasis selectively
- Rely on spacing, scale, and line rhythm more than ornament
- Keep body copy highly legible first

## 11. Verification

Implementation should be verified with:

- `npm test`
- `npm run check`
- `npm run build`
- Local visual review of homepage, article page, archive page, tag index, and single-tag page
- Responsive checks for desktop and mobile widths

## 12. Acceptance Criteria

The redesign is successful when all of the following are true:

- The site clearly reads as an editorial writing space, not a technical card UI
- The homepage keeps its existing structure but feels materially more refined
- The post list reads like an index rather than a set of cards
- The article page is calmer and stronger for long-form reading
- Archive, tag, header, and footer pages all feel like part of the same system
- The mobile layout remains readable and stable
- Build, type/content checks, and tests pass

## 13. Recommended Implementation Direction

Implement the redesign as a cohesive visual-system rewrite across shared layout and page styles, with the homepage article list as the key structural pivot.

The goal is not to add more UI. The goal is to remove unnecessary UI framing until the writing itself becomes the focal point.
