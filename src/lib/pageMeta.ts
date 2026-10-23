/**
 * Title and description of every page, used for the browser tab title (see Layout)
 * and for the <head> tags written into each prerendered page (scripts/prerender.mjs).
 */

import { externalWriting } from "../data/externalWriting";
import { projects } from "../data/projects";
import { site } from "../data/site";
import { posts } from "./blog";

export interface PageMeta {
  title: string;
  description: string;
}

const DEFAULT: PageMeta = {
  title: `${site.name} — AI & Data Science`,
  description:
    "Gurvir Singh — B.Tech CSE student building machine learning tools and learning physics-informed machine learning.",
};

const NOT_FOUND: PageMeta = {
  title: `Page not found — ${site.name}`,
  description: "The page you are looking for does not exist.",
};

function page(title: string, description: string): PageMeta {
  return { title: `${title} — ${site.name}`, description };
}

const pages: Record<string, PageMeta> = {
  "/": DEFAULT,
  "/projects": page(
    "Projects",
    "Projects I have built or am working on, and ideas I am exploring.",
  ),
  "/blog": page("Blog", "Longer pieces on things I am learning, building, and trying to understand."),
  "/learning": page(
    "Learning",
    "What I am learning right now: machine learning and physics-informed machine learning.",
  ),
  "/about": page(
    "About",
    "About Gurvir Singh: education, interests, programming languages and tools, and contact details.",
  ),
  "/cv": page("CV", "Curriculum vitae of Gurvir Singh (PDF)."),
};

for (const project of projects) {
  if (project.details) {
    pages[project.details] = page(project.title, project.subtitle ?? project.description);
  }
}
for (const post of posts) {
  pages[`/blog/${post.slug}`] = page(post.title, post.description || DEFAULT.description);
}

/** Meta for a path such as "/projects/ghost-battery"; unknown paths get the "not found" meta. */
export function pageMeta(path: string): PageMeta {
  const normalized = path.length > 1 ? path.replace(/\/+$/, "") : path;
  return pages[normalized] ?? NOT_FOUND;
}

export const notFoundMeta = NOT_FOUND;

/** Every page to prerender. */
export const prerenderPaths: string[] = Object.keys(pages);

/** Pages listed in sitemap.xml: all of them, except the Blog page while it is empty. */
export const sitemapPaths: string[] = prerenderPaths.filter(
  (path) => path !== "/blog" || posts.length > 0 || externalWriting.length > 0,
);
