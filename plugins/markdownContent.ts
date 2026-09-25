import { marked } from "marked";
import type { Plugin } from "vite";
import { parse as parseYaml } from "yaml";
import { NOTE_CATEGORIES } from "../src/data/noteCategories.ts";

/*
 * Vite plugin: turns Markdown files in src/content/blog/ and src/content/notes/
 * into JavaScript modules at build time, so no Markdown parser is shipped to
 * the browser.
 *
 *   Blog post:     export default { slug, title, date, description, tags, readingMinutes, html }
 *   Research note: export default { slug, title, date, description, category, readingMinutes, html }
 *
 * Invalid frontmatter stops the build with a message naming the file.
 */

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Reading speed used for "N min read". Slower than the ~240 wpm average, for technical text. */
const WORDS_PER_MINUTE = 200;

type Data = Record<string, unknown>;
type Fail = (message: string) => never;

interface Collection {
  dir: string;
  /** Used in error messages, e.g. "Blog post sample-post.md: …". */
  label: string;
  /** Validates the frontmatter fields specific to this collection. Must return `slug`. */
  fields(data: Data, file: string, fail: Fail): { slug: string } & Data;
}

const collections: Collection[] = [
  {
    dir: "/src/content/blog/",
    label: "Blog post",
    fields(data, _file, fail) {
      const slug = data.slug;
      if (typeof slug !== "string" || !SLUG.test(slug)) {
        fail('"slug" is required and may only contain lowercase letters, numbers and hyphens.');
      }
      const rawTags = data.tags ?? [];
      const tags = (Array.isArray(rawTags) ? rawTags : [rawTags]).map(String);
      return { slug: slug as string, tags };
    },
  },
  {
    dir: "/src/content/notes/",
    label: "Research note",
    fields(data, file, fail) {
      // The slug defaults to the file name: what-is-piml.md → /notes/what-is-piml.
      const slug = data.slug ?? file.replace(/\.md$/, "");
      if (typeof slug !== "string" || !SLUG.test(slug)) {
        fail(
          '"slug" (or the file name, if no slug is given) may only contain lowercase letters, numbers and hyphens.',
        );
      }
      const category = data.category;
      if (!(NOTE_CATEGORIES as readonly unknown[]).includes(category)) {
        fail(`"category" is required and must be one of: ${NOTE_CATEGORIES.join(", ")}.`);
      }
      return { slug: slug as string, category };
    },
  },
];

export default function markdownContent(): Plugin {
  // "<collection dir><slug>" → path of the file that uses it, to catch duplicates.
  const fileBySlug = new Map<string, string>();

  return {
    name: "markdown-content",
    enforce: "pre",

    transform(source, id) {
      const path = id.split("?")[0].replaceAll("\\", "/");
      if (!path.endsWith(".md")) return null;
      const collection = collections.find((c) => path.includes(c.dir));
      if (!collection) return null;

      const file = path.slice(path.lastIndexOf("/") + 1);
      const fail: Fail = (message) => this.error(`${collection.label} ${file}: ${message}`);

      const match = FRONTMATTER.exec(source);
      if (!match) fail("missing frontmatter block (--- … ---) at the top of the file.");
      const data = (parseYaml(match![1]) ?? {}) as Data;

      const title = data.title;
      if (typeof title !== "string" || !title.trim()) fail('"title" is required.');

      // Accept quoted ("2026-09-14") or unquoted dates.
      const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date;
      if (typeof date !== "string" || !DATE.test(date) || Number.isNaN(Date.parse(date))) {
        fail('"date" is required and must look like "2026-09-14".');
      }

      const fields = collection.fields(data, file, fail);
      const key = collection.dir + fields.slug;
      const existing = fileBySlug.get(key);
      if (existing && existing !== path) {
        fail(
          `slug "${fields.slug}" is already used by ${existing.slice(existing.lastIndexOf("/") + 1)}.`,
        );
      }
      fileBySlug.set(key, path);

      const description = data.description ?? "";
      if (typeof description !== "string") fail('"description" must be text.');

      // The title is rendered from frontmatter, so drop a leading "# Title" line when it
      // repeats that title. Any other "# Heading" is kept as a real heading.
      const rest = source.slice(match![0].length);
      const leading = /^\s*#[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*(?:\r?\n|$)/.exec(rest);
      const sameText = (a: string, b: string) =>
        a.replace(/\s+/g, " ").trim().toLowerCase() === b.replace(/\s+/g, " ").trim().toLowerCase();
      const body = leading && sameText(leading[1], title as string) ? rest.slice(leading[0].length) : rest;
      const html = (marked.parse(body, { async: false, gfm: true }) as string).replaceAll(
        "<img ",
        '<img loading="lazy" ',
      );

      // Count words in the rendered text, so link URLs and Markdown syntax are not counted.
      const words = html.replace(/<[^>]+>/g, " ").match(/\S+/g)?.length ?? 0;
      const readingMinutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

      const entry = { ...fields, title, date, description, readingMinutes, html };
      return { code: `export default ${JSON.stringify(entry)};`, map: null };
    },
  };
}
