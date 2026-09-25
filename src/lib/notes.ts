/**
 * Loads every Markdown research note in src/content/notes/.
 *
 * Notes are converted to HTML at build time by plugins/markdownContent.ts,
 * so adding a .md file there is all that is needed for it to appear.
 */

import type { NoteCategory } from "../data/noteCategories";

export interface Note {
  slug: string;
  title: string;
  /** "YYYY-MM-DD" */
  date: string;
  description: string;
  /** Estimated reading time, computed at build time. */
  readingMinutes: number;
  category: NoteCategory;
  html: string;
}

const modules = import.meta.glob<Note>("../content/notes/*.md", {
  eager: true,
  import: "default",
});

/** All notes, newest first. */
export const notes: Note[] = Object.values(modules).sort(
  (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
);

export function getNote(slug: string): Note | undefined {
  return notes.find((note) => note.slug === slug);
}
