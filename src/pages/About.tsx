import { Fragment } from "react";
import { Link } from "react-router";
import PageHeader from "../components/PageHeader";
import { Value } from "../components/Placeholder";
import SectionHeading from "../components/SectionHeading";
import { site } from "../data/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";

/** "A · B · C". Lines only break between items, so no line starts with "·". */
function Separated({ items }: { items: string[] }) {
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

/** A small grey label with its values on the line below. */
function LabeledRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm text-faint">{label}</h3>
      <p className="mt-0.5 text-[0.9375rem] leading-relaxed">
        <Separated items={items} />
      </p>
    </div>
  );
}

export default function About() {
  useDocumentTitle("About");
  const { education } = site;

  return (
    <>
      <PageHeader title="About" />

      <div className="max-w-2xl space-y-3 leading-relaxed">
        <p>
          I am a third-year Computer Science student specializing in Artificial Intelligence and
          Data Science.
        </p>
        <p>
          I am currently exploring machine learning, data science, and physics-informed machine
          learning. What interests me most about machine learning is not being tied to one
          application or field, but understanding it well enough to use it when a problem calls
          for it. More generally, I get curious about technical problems even when they fall
          outside my specialization.
        </p>
        <p>
          I learn with the goal of understanding things well enough to build with them, explain
          and teach them to other people, and help solve problems.
        </p>
        <p>
          One idea I am exploring as I learn more about physics-informed machine learning is{" "}
          <Link to="/projects/ghost-battery" className="link">
            Ghost Battery
          </Link>
          , an attempt to think about how observable telemetry and physical knowledge might be
          used to reason about hidden energy states.
        </p>
      </div>

      <section aria-labelledby="education" className="mt-12">
        <SectionHeading id="education">Education</SectionHeading>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
          <h3 className="font-serif text-lg font-semibold leading-snug text-ink">
            <Value value={education.institution} />
          </h3>
          <p className="text-sm text-faint">
            Expected <Value value={education.expectedGraduation} />
          </p>
        </div>
        <p className="mt-1">
          {education.degree}
          {" "}— {education.specialization}
        </p>
        <p className="mt-0.5 text-muted">
          <Value value={education.year} />
          {" "}· CGPA <Value value={education.cgpa} />
        </p>
        <p className="mt-2 text-sm leading-relaxed">
          <span className="text-faint">Current coursework:</span>{" "}
          <span className="text-muted">
            <Separated items={site.coursework} />
          </span>
        </p>
      </section>

      <section aria-labelledby="interests" className="mt-12">
        <SectionHeading id="interests">Interests</SectionHeading>
        <div className="space-y-3">
          <LabeledRow label="Current focus" items={site.interests.current} />
          <LabeledRow label="Also interested in" items={site.interests.broader} />
        </div>
      </section>

      <section aria-labelledby="skills" className="mt-12">
        <SectionHeading id="skills">Programming &amp; tools</SectionHeading>
        <div className="space-y-3">
          <LabeledRow label="Languages" items={site.languages} />
          <LabeledRow label="ML & data" items={site.mlTools} />
        </div>
      </section>

      <section aria-labelledby="contact" className="mt-12">
        <SectionHeading id="contact">Contact</SectionHeading>
        <dl className="grid grid-cols-[5rem_1fr] gap-y-2">
          <dt className="text-faint">Email</dt>
          <dd className="break-all">
            <a href={`mailto:${site.email}`} className="link">
              {site.email}
            </a>
          </dd>

          <dt className="text-faint">GitHub</dt>
          <dd className="break-all">
            <a href={site.github} className="link">
              {site.github.replace(/^https:\/\//, "")}
            </a>
          </dd>

          {site.linkedin && (
            <>
              <dt className="text-faint">LinkedIn</dt>
              <dd className="break-all">
                <a href={site.linkedin} className="link">
                  {site.linkedin.replace(/^https:\/\/(www\.)?/, "")}
                </a>
              </dd>
            </>
          )}
        </dl>
      </section>
    </>
  );
}
