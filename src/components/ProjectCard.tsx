import { Fragment, type ReactNode } from "react";
import { Link } from "react-router";
import type { Project } from "../data/projects";
import Placeholder, { Value } from "./Placeholder";

/**
 * How a project is shown on the Projects page:
 *   full     title, status, full description, technologies, links (Selected work)
 *   compact  same, but only the first sentence of the description (Other projects)
 *   idea     status directly under the title, then subtitle and description (Exploration)
 */
export type ProjectCardVariant = "full" | "compact" | "idea";

/** "First sentence. Second sentence." → "First sentence." */
function firstSentence(text: string): string {
  return text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;
}

/**
 * "A · B · C", keeping each separator on the same line as the item before it.
 * Lines may only break at the spaces between items.
 */
function Technologies({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, i) => (
        <Fragment key={item}>
          <span className="whitespace-nowrap">
            {item}
            {i < items.length - 1 && " ·"}
          </span>
          {i < items.length - 1 && " "}
        </Fragment>
      ))}
    </>
  );
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
  } else if (github === null) {
    links.push(
      <span key="code" className="text-faint">
        Code <Placeholder>[PLACEHOLDER]</Placeholder>
      </span>,
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
        <p className="mt-0.5 text-[0.9375rem] text-muted">
          <Value value={status} />
        </p>
        {subtitle && <p className="mt-2 text-muted italic">{subtitle}</p>}
        <p className="mt-1.5">{description}</p>
        <div className="mt-2 text-sm">
          <ProjectLinks project={project} />
        </div>
      </li>
    );
  }

  const compact = variant === "compact";

  return (
    <li className={compact ? "py-4 first:pt-0 last:pb-0" : "py-5 first:pt-0 last:pb-0"}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <h3
          className={`font-serif font-semibold leading-snug text-ink ${compact ? "text-base" : "text-lg"}`}
        >
          {title}
        </h3>
        <p className="text-sm text-faint">
          <Value value={status} />
        </p>
      </div>
      <p className={compact ? "mt-1" : "mt-1.5"}>
        {compact ? firstSentence(description) : description}
      </p>
      {!compact && project.image && (
        <img
          src={project.image.src}
          alt={project.image.alt}
          loading="lazy"
          className="mt-3 w-full border border-rule"
        />
      )}
      <div
        className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm ${compact ? "mt-1" : "mt-2"}`}
      >
        {technologies.length > 0 && (
          <p className="text-muted">
            <Technologies items={technologies} />
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
