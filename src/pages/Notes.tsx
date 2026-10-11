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
            <ol className="card-grid">
              {section.items.map((note) => (
                <li key={note.slug} className="card card-lift">
                  <p className="card-label bg-tint-green text-ink">Research note</p>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-display text-lg leading-snug font-bold text-ink">
                      <Link to={`/notes/${note.slug}`} className="stretched-link hover:text-accent">
                        {note.title}
                      </Link>
                    </h3>
                    {note.description && (
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                        {note.description}
                      </p>
                    )}
                    <p className="card-rule mt-auto pt-2 text-sm text-faint">
                      <time dateTime={note.date}>{formatDate(note.date)}</time>
                      {" · "}
                      {note.readingMinutes} min read
                    </p>
                  </div>
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
