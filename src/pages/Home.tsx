import { Link } from "react-router";
import { ProjectList } from "../components/ProjectCard";
import SectionHeading from "../components/SectionHeading";
import { getProject, projects } from "../data/projects";
import { site } from "../data/site";
import { formatDate } from "../lib/formatDate";
import { notes } from "../lib/notes";

const learning = [
  {
    topic: "Machine Learning",
    note: "Strengthening my understanding of the fundamentals, so that I can apply machine learning to problems in different fields.",
  },
  {
    topic: "Physics-Informed Machine Learning",
    note: "Learning how machine learning can be combined with physical knowledge and mathematical models.",
  },
  {
    topic: "Data, systems and beyond",
    note: "Working with data and systems through projects, and exploring technical problems outside these areas too.",
  },
];

export default function Home() {
  // Same projects as "Selected Work" on the Projects page.
  const selectedWork = projects.filter((p) => p.section === "selected");
  const idea = getProject("ghost-battery");
  const latestNote = notes[0]; // notes are sorted newest first
  const university = site.education.institution.split(",")[0];

  return (
    <>
      <section aria-labelledby="intro">
        <h1 id="intro" className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
          {site.name}
        </h1>
        <p className="mt-2 text-muted">
          I build machine learning tools for messy real-world data — from log anomaly detection
          to LLM-driven Blender scripting — and I am learning physics-informed machine learning.
        </p>

        <div className="mt-3 flex flex-col text-sm leading-relaxed md:flex-row md:flex-wrap md:justify-between md:gap-x-6">
          <p>
            {site.shortDegree} <span className="text-faint">·</span>{" "}
            <span className="whitespace-nowrap">{university}</span>{" "}
            <span className="text-faint">·</span>{" "}
            <span className="whitespace-nowrap">{site.education.year}</span>
          </p>
          <p>
            <a href={`mailto:${site.email}`} className="link">
              {site.email}
            </a>
            {" "}
            <span className="text-faint">·</span>{" "}
            <a href={site.github} className="link">
              GitHub
            </a>
            {" "}
            <span className="text-faint">·</span>{" "}
            {site.linkedin && (
              <>
                <a href={site.linkedin} className="link">
                  LinkedIn
                </a>
                {" "}
                <span className="text-faint">·</span>{" "}
              </>
            )}
            <a href={site.cvUrl} className="link whitespace-nowrap">
              CV (PDF)
            </a>
          </p>
        </div>

        <p className="mt-5 leading-relaxed">
          I enjoy learning how things work, building with what I learn, and solving problems
          along the way. My interests currently lie in AI/ML, data science, and physics-informed
          machine learning, with a broader curiosity about technology and its applications across
          different fields.
        </p>
      </section>

      <section aria-labelledby="selected-work" className="mt-10">
        <SectionHeading
          id="selected-work"
          aside={
            <Link to="/projects" className="link">
              All projects
            </Link>
          }
        >
          Selected work
        </SectionHeading>

        <ProjectList projects={selectedWork} variant="summary" />
      </section>

      <section aria-labelledby="currently-learning" className="mt-10">
        <SectionHeading
          id="currently-learning"
          aside={
            <Link to="/notes" className="link">
              Research Notes
            </Link>
          }
        >
          Currently learning
        </SectionHeading>

        <dl className="space-y-1.5 text-[0.9375rem] leading-normal">
          {learning.map((item) => (
            <div key={item.topic}>
              <dt className="inline font-semibold text-ink">{item.topic}</dt>{" "}
              <dd className="inline text-muted">
                <span aria-hidden="true">— </span>
                {item.note}
              </dd>
            </div>
          ))}
        </dl>

        {(latestNote || idea) && (
          <div className="mt-3 space-y-0.5 border-t border-rule pt-2 text-sm leading-relaxed">
            {latestNote && (
              <p>
                <span className="text-faint">Latest note:</span>{" "}
                <Link to={`/notes/${latestNote.slug}`} className="link">
                  {latestNote.title}
                </Link>{" "}
                <span className="text-faint">
                  · <time dateTime={latestNote.date}>{formatDate(latestNote.date)}</time>
                </span>
              </p>
            )}
            {idea && (
              <p>
                <span className="text-faint">Idea:</span>{" "}
                <span className="font-semibold text-ink">{idea.title}</span>{" "}
                <span className="text-muted">— {idea.subtitle}</span>
                {idea.details && (
                  <>
                    {" "}
                    <Link to={idea.details} className="link whitespace-nowrap">
                      Details<span className="sr-only">: {idea.title}</span>{" "}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </>
                )}
              </p>
            )}
          </div>
        )}
      </section>
    </>
  );
}
