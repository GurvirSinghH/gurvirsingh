/**
 * Loads every Markdown post in src/content/blog/.
 *
 * Posts are converted to HTML at build time by plugins/markdownContent.ts,
 * so adding a .md file there is all that is needed for it to appear.
 */

export interface BlogPost {
  slug: string;
  title: string;
  /** "YYYY-MM-DD" */
  date: string;
  description: string;
  /** Estimated reading time, computed at build time. */
  readingMinutes: number;
  tags: string[];
  html: string;
}

const modules = import.meta.glob<BlogPost>("../content/blog/*.md", {
  eager: true,
  import: "default",
});

/** All posts, newest first. */
export const posts: BlogPost[] = Object.values(modules).sort(
  (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
);

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}
