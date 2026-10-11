import type { ReactNode } from "react";
import { Link } from "react-router";
import type { Project, ProjectSection } from "../data/projects";
import Separated from "./Separated";

/**
 * How a project is shown:
 *   full     full description, screenshot, technologies, status, links (Selected work)
 *   summary  same, but only the first sentence of the description and no screenshot (Home)
 *   compact  like summary (Other projects)
 *   idea     subtitle, full description, status, links (Exploration)
 *
 * Every project is a card. The label strip at the top says what kind of project it is,
 * and the whole card links to the project's details page or, if it has none, its code.
 */
export type ProjectCardVariant = "full" | "summary" | "compact" | "idea";

const LABELS: Record<ProjectSection, { text: string; className: string }> = {
  selected: { text: "Featured project", className: "bg-ink text-page" },
  other: { text: "Project", className: "bg-tint-blue text-ink" },
  exploration: { text: "Idea", className: "bg-tint-yellow text-ink" },
};

/** "First sentence. Second sentence." → "First sentence." */
function firstSentence(text: string): string {
  return text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;
}

/** Where a click on the card goes: the details page, else the code, demo or video. */
function mainLink(project: Project): string | undefined {
  return project.details ?? project.github ?? project.demo ?? project.video;
}

function ProjectLinks({ project }: { project: Project }) {
  const { title, github, demo, video, details } = project;
  const links: ReactNode[] = [];

  if (details) {
    links.push(
      <Link key="details" to={details} className="link">
        Details<span className="sr-only">: {title}</span> <span aria-hidden="true">→</span>
      </Link>,
    );
  }
  if (github) {
    links.push(
      <a key="code" href={github} className="link">
        Code<span className="sr-only">: {title} on GitHub</span> <span aria-hidden="true">↗</span>
      </a>,
    );
  }
  if (demo) {
    links.push(
      <a key="demo" href={demo} className="link">
        Live demo<span className="sr-only">: {title}</span> <span aria-hidden="true">↗</span>
      </a>,
    );
  }
  if (video) {
    links.push(
      <a key="video" href={video} className="link">
        Video<span className="sr-only">: {title}</span> <span aria-hidden="true">↗</span>
      </a>,
    );
  }

  if (links.length === 0) return null;
  // `relative z-10` keeps these clickable above the card-wide link.
  return <p className="card-rule relative z-10 flex flex-wrap gap-x-4 pt-2">{links}</p>;
}

function CardTitle({ project }: { project: Project }) {
  const href = mainLink(project);
  const className = "stretched-link hover:text-accent";

  if (!href) return <>{project.title}</>;
  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className}>
        {project.title}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {project.title}
    </a>
  );
}

export default function ProjectCard({
  project,
  variant = "full",
}: {
  project: Project;
  variant?: ProjectCardVariant;
}) {
  const { subtitle, description, technologies, status, section } = project;
  const label = LABELS[section];
  const short = variant === "summary" || variant === "compact";

  return (
    <li className={`card ${mainLink(project) ? "card-lift" : ""}`}>
      <p className={`card-label ${label.className}`}>{label.text}</p>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg leading-snug font-bold text-ink">
          <CardTitle project={project} />
        </h3>
        {variant === "idea" && subtitle && <p className="mt-1 text-muted italic">{subtitle}</p>}
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
          {short ? firstSentence(description) : description}
        </p>
        {variant === "full" && project.image && (
          <img
            src={project.image.src}
            alt={project.image.alt}
            loading="lazy"
            className="mt-4 w-full border border-rule"
          />
        )}

        <div className="mt-auto pt-4 text-sm">
          {technologies.length > 0 && (
            <p className="card-rule py-2 text-muted">
              <Separated items={technologies} />
            </p>
          )}
          <p className="card-rule py-2">
            <span className="text-faint">Status:</span>{" "}
            <span className="font-semibold">{status}</span>
          </p>
          <ProjectLinks project={project} />
        </div>
      </div>
    </li>
  );
}

/**
 * Projects as cards: two per row for the short variants, one per row for the full and
 * idea variants, which have longer text.
 */
export function ProjectList({
  projects,
  variant = "full",
}: {
  projects: Project[];
  variant?: ProjectCardVariant;
}) {
  const twoUp = variant === "summary" || variant === "compact";
  return (
    <ul className={twoUp ? "card-grid" : "grid gap-6"}>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} variant={variant} />
      ))}
    </ul>
  );
}
