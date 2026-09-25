import { Link } from "react-router";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";
import { NOTE_CATEGORIES } from "../data/noteCategories";
import { formatDate } from "../lib/formatDate";
import { notes } from "../lib/notes";

export default function Notes() {
  // One section per category that has notes, in the order the categories are declared.
  // Notes stay newest first inside each section.
  const sections = NOTE_CATEGORIES.map((category) => ({
    category,
    id: category.toLowerCase().replace(/\s+/g, "-"),
    items: notes.filter((note) => note.category === category),
  })).filter((section) => section.items.length > 0);

  return (
    <>
      <PageHeader title="Research Notes">
        <p>Notes, experiments, and questions from things I'm learning.</p>
      </PageHeader>

      {notes.length > 0 ? (
        sections.map((section, i) => (
          <section
            key={section.category}
            aria-labelledby={section.id}
            className={i > 0 ? "mt-12" : undefined}
          >
            <SectionHeading id={section.id}>{section.category}</SectionHeading>
            <ol className="divide-y divide-rule">
              {section.items.map((note) => (
                <li key={note.slug} className="py-5 first:pt-0 last:pb-0">
                  <h3 className="font-serif text-lg font-semibold leading-snug text-ink">
                    <Link to={`/notes/${note.slug}`} className="hover:text-accent hover:underline">
                      {note.title}
                    </Link>
                  </h3>
                  <p className="mt-0.5 text-sm text-faint">
                    <time dateTime={note.date}>{formatDate(note.date)}</time>
                    {" · "}
                    {note.readingMinutes} min read
                  </p>
                  {note.description && <p className="mt-1.5">{note.description}</p>}
                </li>
              ))}
            </ol>
          </section>
        ))
      ) : (
        <p className="text-muted">No notes yet.</p>
      )}
    </>
  );
}
