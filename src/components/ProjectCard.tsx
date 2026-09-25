import type { ReactNode } from "react";
import { Link } from "react-router";
import type { Project } from "../data/projects";
import Separated from "./Separated";

/**
 * How a project is shown:
 *   full     title, status, full description, screenshot, technologies, links (Selected work)
 *   summary  same, but only the first sentence of the description and no screenshot (Home)
 *   compact  like summary, with a smaller title (Other projects)
 *   idea     status directly under the title, then subtitle and description (Exploration)
 */
export type ProjectCardVariant = "full" | "summary" | "compact" | "idea";

/** "First sentence. Second sentence." → "First sentence." */
function firstSentence(text: string): string {
  return text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;
}

function ProjectLinks({ project }: { project: Project }) {
  const { title, github, demo, video, details } = project;
  const links: ReactNode[] = [];

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
  if (details) {
    links.push(
      <Link key="details" to={details} className="link">
        Details<span className="sr-only">: {title}</span> <span aria-hidden="true">→</span>
      </Link>,
    );
  }

  if (links.length === 0) return null;
  return <p className="flex flex-wrap gap-x-4">{links}</p>;
}

export default function ProjectCard({
  project,
  variant = "full",
}: {
  project: Project;
  variant?: ProjectCardVariant;
}) {
  const { title, subtitle, description, technologies, status } = project;

  if (variant === "idea") {
    return (
      <li className="py-5 first:pt-0 last:pb-0">
        <h3 className="font-serif text-lg font-semibold leading-snug text-ink">{title}</h3>
        <p className="mt-0.5 text-[0.9375rem] text-muted">{status}</p>
        {subtitle && <p className="mt-2 text-muted italic">{subtitle}</p>}
        <p className="mt-1.5">{description}</p>
        <div className="mt-2 text-sm">
          <ProjectLinks project={project} />
        </div>
      </li>
    );
  }

  const short = variant !== "full";

  return (
    <li className={short ? "py-4 first:pt-0 last:pb-0" : "py-5 first:pt-0 last:pb-0"}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <h3
          className={`font-serif font-semibold leading-snug text-ink ${variant === "compact" ? "text-base" : "text-lg"}`}
        >
          {title}
        </h3>
        <p className="text-sm text-faint">{status}</p>
      </div>
      <p className={short ? "mt-1" : "mt-1.5"}>{short ? firstSentence(description) : description}</p>
      {!short && project.image && (
        <img
          src={project.image.src}
          alt={project.image.alt}
          loading="lazy"
          className="mt-3 w-full border border-rule"
        />
      )}
      <div
        className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm ${short ? "mt-1" : "mt-2"}`}
      >
        {technologies.length > 0 && (
          <p className="text-muted">
            <Separated items={technologies} />
          </p>
        )}
        <ProjectLinks project={project} />
      </div>
    </li>
  );
}

/** Projects as a list separated by thin rules. */
export function ProjectList({
  projects,
  variant = "full",
}: {
  projects: Project[];
  variant?: ProjectCardVariant;
}) {
  return (
    <ul className="divide-y divide-rule">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} variant={variant} />
      ))}
    </ul>
  );
}
