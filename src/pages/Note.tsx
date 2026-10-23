import { Link, useParams } from "react-router";
import { formatDate } from "../lib/formatDate";
import { getNote } from "../lib/notes";
import NotFound from "./NotFound";

export default function NotePage() {
  const { slug = "" } = useParams();
  const note = getNote(slug);

  if (!note) return <NotFound />;

  return (
    <article>
      <header className="max-w-5xl">
        <h1 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.9] font-extrabold text-ink">
          {note.title}
        </h1>
        <p className="mt-3 text-sm text-faint">
          <time dateTime={note.date}>{formatDate(note.date)}</time>
          {" · "}
          {note.category}
          {" · "}
          {note.readingMinutes} min read
        </p>
      </header>

      {/* HTML generated at build time from the note's Markdown file. */}
      <div
        className="article mt-10 max-w-2xl border-t border-rule pt-8"
        dangerouslySetInnerHTML={{ __html: note.html }}
      />

      <footer className="mt-14 max-w-2xl border-t border-rule pt-6">
        <Link to="/notes" className="link">
          ← Back to Research Notes
        </Link>
      </footer>
    </article>
  );
}
