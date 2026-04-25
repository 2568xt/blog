import { siteConfig } from "../config/site";

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, "");
}

function needsTrailingSlash(path: string): boolean {
  return !/\.[a-z0-9]+$/i.test(path);
}

export function withBase(pathname: string): string {
  const base = trimSlashes(siteConfig.basePath);
  const path = trimSlashes(pathname);

  if (!base && !path) {
    return "/";
  }

  if (!path) {
    return `/${base}/`;
  }

  if (!base) {
    return needsTrailingSlash(path) ? `/${path}/` : `/${path}`;
  }

  const prefixedPath = `/${base}/${path}`;

  return needsTrailingSlash(path) ? `${prefixedPath}/` : prefixedPath;
}

export function slugifySegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function postPath(slug: string): string {
  return withBase(`posts/${trimSlashes(slug)}`);
}

export function tagPath(tag: string): string {
  return withBase(`tags/${slugifySegment(tag)}`);
}

export function homePath(): string {
  return withBase("/");
}

export function archivePath(): string {
  return withBase("archives");
}

export function tagsPath(): string {
  return withBase("tags");
}

export function feedPath(): string {
  return withBase("rss.xml");
}
