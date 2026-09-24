import { Link } from "react-router";
import SectionHeading from "../components/SectionHeading";
import { getProject, projects, type Project } from "../data/projects";
import { isPlaceholder, site } from "../data/site";
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

/** "First sentence. Second sentence." → "First sentence." */
function firstSentence(text: string): string {
  return text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;
}

/** Compact, text-only entry for a built project (the Projects page uses ProjectCard). */
function WorkEntry({ project }: { project: Project }) {
  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="font-serif text-lg font-semibold leading-snug text-ink">{project.title}</h3>
        <p className="text-sm text-faint">{project.status}</p>
      </div>
      <p className="mt-1">{firstSentence(project.description)}</p>
      <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 text-sm">
        <p className="text-muted">{project.technologies.join(" · ")}</p>
        {project.github && (
          <a href={project.github} className="link">
            Code<span className="sr-only">: {project.title} on GitHub</span>{" "}
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </li>
  );
}

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
            B.Tech CSE (AI &amp; Data Science) <span className="text-faint">·</span>{" "}
            <span className="whitespace-nowrap">{university}</span>{" "}
            <span className="text-faint">·</span>{" "}
            <span className="whitespace-nowrap">{site.education.year}</span>
          </p>
          <p>
            {!isPlaceholder(site.email) && (
              <>
                <a href={`mailto:${site.email}`} className="link">
                  {site.email}
                </a>
                {" "}
                <span className="text-faint">·</span>{" "}
              </>
            )}
            <a href={site.github} className="link">
              GitHub
            </a>
            {" "}
            <span className="text-faint">·</span>{" "}
            {site.linkedin && (
              <>
                <a href={site.linkedin} className="link">
                  LinkedIn
                </a>{" "}
                <span className="text-faint">·</span>{" "}
              </>
            )}
            {site.cvUrl ? (
              <a href={site.cvUrl} className="link whitespace-nowrap">
                CV (PDF)
              </a>
            ) : (
              <Link to="/cv" className="link">
                CV
              </Link>
            )}
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

        <ul className="divide-y divide-rule">
          {selectedWork.map((project) => (
            <WorkEntry key={project.slug} project={project} />
          ))}
        </ul>
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
