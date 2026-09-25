import type { ReactNode } from "react";
import { Link } from "react-router";
import LinkButton from "../../components/LinkButton";
import SectionHeading from "../../components/SectionHeading";
import { getProject } from "../../data/projects";

/*
 * Ghost Battery — idea / research exploration page.
 *
 * Ghost Battery has NOT been built or validated. Everything under
 * "Possible approach" is a proposal, not a description of working software.
 * Title, subtitle, status and any links come from src/data/projects.ts.
 */

const project = getProject("ghost-battery")!;

const sections = [
  { id: "idea", title: "The idea" },
  { id: "why", title: "Why I find this problem interesting" },
  { id: "possible-approach", title: "Possible approach" },
  { id: "what-i-need-to-learn", title: "What I need to learn" },
  { id: "future-direction", title: "Future direction" },
];

type Kind = "Measured" | "Derived" | "Inferred";

// Proposed stages only — none of these exist.
const pipeline: { name: string; description: string; kind: Kind }[] = [
  {
    name: "Public Telemetry",
    description: "Car and timing data from public Formula 1 sources such as FastF1 and OpenF1.",
    kind: "Measured",
  },
  {
    name: "Physics Reconstruction",
    description: "Would reconstruct physical quantities that are not reported directly.",
    kind: "Derived",
  },
  {
    name: "Power Balance",
    description: "Would relate the reconstructed motion to power demand using a physics-based model.",
    kind: "Derived",
  },
  {
    name: "Constrained State Estimation",
    description:
      "Could track the hidden energy state with an Extended Kalman Filter and RTS smoothing, subject to physical constraints.",
    kind: "Inferred",
  },
  {
    name: "ML Residual Correction",
    description:
      "A model such as LightGBM could correct systematic error left by the physics-based estimate.",
    kind: "Inferred",
  },
  {
    name: "Estimated Energy State",
    description: "Would be a normalized energy-budget index with uncertainty — not a battery percentage.",
    kind: "Inferred",
  },
  {
    name: "Attack Intelligence",
    description: "Would use the estimate to reason about the energy cost and value of overtaking.",
    kind: "Inferred",
  },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-14">
      <SectionHeading id={id}>{title}</SectionHeading>
      <div className="max-w-2xl space-y-4">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 font-semibold text-ink">{children}</h3>;
}

export default function GhostBattery() {
  const hasLinks = project.github || project.demo || project.video;

  return (
    <article>
      <p className="text-sm">
        <Link to="/projects" className="link">
          ← Projects
        </Link>
      </p>

      <header className="mt-6">
        <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">{project.title}</h1>
        <p className="mt-2 text-lg text-muted italic">{project.subtitle}</p>

        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-faint">Status</dt>
          <dd className="text-muted">{project.status}</dd>
        </dl>

        {hasLinks && (
          <ul aria-label="Project links" className="mt-5 flex flex-wrap gap-2">
            {project.github && (
              <li>
                <LinkButton href={project.github} context="Ghost Battery repository">
                  GitHub
                </LinkButton>
              </li>
            )}
            {project.demo && (
              <li>
                <LinkButton href={project.demo}>Live Demo</LinkButton>
              </li>
            )}
            {project.video && (
              <li>
                <LinkButton href={project.video}>Demo Video</LinkButton>
              </li>
            )}
          </ul>
        )}
      </header>

      <nav aria-labelledby="contents" className="mt-10 border-y border-rule py-4 text-sm">
        <h2 id="contents" className="font-serif text-xl font-semibold text-ink">
          Contents
        </h2>
        <ol className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 min-[400px]:grid-cols-2 sm:grid-cols-3">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="link">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <Section id="idea" title="The idea">
        <p>
          Formula 1 cars deploy and recover electrical energy over a lap, but how much energy a car
          has available at any moment is not part of public telemetry. Public sources such as
          FastF1 and OpenF1 report quantities like speed, throttle, brake and position — not the
          state of the car's energy store.
        </p>
        <p>
          The idea is to explore whether that hidden energy state could be estimated from public
          data by combining physics-based models with machine learning, and whether such an
          estimate — with its uncertainty stated clearly — could help reason about the energy cost
          and value of an overtaking attempt.
        </p>
      </Section>

      <Section id="why" title="Why I find this problem interesting">
        <ul className="list-disc space-y-2 pl-5 marker:text-faint">
          <li>
            It is a concrete example of what interests me about physics-informed machine learning:
            combining physical knowledge with machine learning to estimate something that cannot be
            observed directly.
          </li>
          <li>
            Neither approach looks sufficient on its own. A purely physical model would need car
            parameters that are not public, and a purely data-driven model would have no ground
            truth to learn from.
          </li>
          <li>
            Any honest answer has to come with uncertainty, and has to be clear about what is
            measured and what is only estimated.
          </li>
          <li>The data is public, so the problem can be explored without access to team data.</li>
        </ul>
      </Section>

      <Section id="possible-approach" title="Possible approach">
        <p className="border border-rule bg-wash px-4 py-3">
          <strong className="font-semibold">Proposed approach only.</strong> Nothing in this
          section has been implemented or tested. It is a conceptual sketch of how the problem
          might be approached, and it is likely to change as I learn more.
        </p>

        <SubHeading>Measured, derived and inferred</SubHeading>
        <p>
          One principle I would want to keep is a strict distinction between what is observed and
          what is estimated. Every quantity would be treated as one of three kinds:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink/30">
                <th scope="col" className="py-2 pr-4 font-semibold">
                  Kind
                </th>
                <th scope="col" className="py-2 font-semibold">
                  Meaning
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              <tr>
                <th scope="row" className="py-2 pr-4 align-top font-mono text-xs tracking-wide">
                  MEASURED
                </th>
                <td className="py-2">Reported directly by public telemetry and timing data.</td>
              </tr>
              <tr>
                <th scope="row" className="py-2 pr-4 align-top font-mono text-xs tracking-wide">
                  DERIVED
                </th>
                <td className="py-2">
                  Computed from measured quantities using physics-based relationships.
                </td>
              </tr>
              <tr>
                <th scope="row" className="py-2 pr-4 align-top font-mono text-xs tracking-wide">
                  INFERRED
                </th>
                <td className="py-2">
                  Not observable; estimated by a model and reported with uncertainty.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <SubHeading>Conceptual pipeline</SubHeading>
        <p>A possible sequence of stages, from public data to decision support:</p>

        <ol className="space-y-0">
          {pipeline.map((stage, i) => (
            <li key={stage.name}>
              {i > 0 && (
                <div aria-hidden="true" className="py-1 pl-6 font-mono text-faint">
                  ↓
                </div>
              )}
              <div className="border border-rule px-4 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="font-semibold">{stage.name}</span>
                  <span className="font-mono text-xs tracking-wide text-faint uppercase">
                    {stage.kind}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted">{stage.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <SubHeading>Possible tools</SubHeading>
        <p>
          Python with NumPy and SciPy for physics-based modeling and state estimation, LightGBM for
          a possible residual model, and FastF1 and OpenF1 for data. These are candidates, not
          choices that have been tried.
        </p>

        <SubHeading>What the output would be</SubHeading>
        <p>
          Not a battery percentage. The true value is not publicly available, so the most that
          could honestly be claimed is a normalized energy-budget index with uncertainty.
        </p>
      </Section>

      <Section id="what-i-need-to-learn" title="What I need to learn">
        <ul className="list-disc space-y-2 pl-5 marker:text-faint">
          <li>
            Physics-informed machine learning fundamentals: the different ways physical knowledge
            and machine learning models can be combined.
          </li>
          <li>
            State estimation: Kalman filters, the Extended Kalman Filter, and smoothing methods
            such as Rauch–Tung–Striebel (RTS) smoothing.
          </li>
          <li>Vehicle dynamics basics: how speed, acceleration, forces and power relate.</li>
          <li>
            How Formula 1 power units deploy and recover electrical energy, and the rules that
            limit it.
          </li>
          <li>
            What public telemetry from FastF1 and OpenF1 actually contains, including its sampling,
            noise and gaps.
          </li>
          <li>
            Uncertainty quantification, and how an estimate can be checked when there is no ground
            truth to compare against.
          </li>
        </ul>
      </Section>

      <Section id="future-direction" title="Future direction">
        <p>
          For now, the focus is on learning the fundamentals above. As my understanding grows,
          possible next steps would be:
        </p>
        <ol className="list-decimal space-y-2 pl-5 marker:text-faint">
          <li>
            Start small: reconstruct basic physical quantities from public telemetry and check
            whether they are physically plausible.
          </li>
          <li>
            Work out whether a constrained state estimator can track a hidden energy state in a
            meaningful way, and what its uncertainty would look like.
          </li>
          <li>
            Decide how any estimate could be evaluated without ground truth, and what a machine
            learning residual model could even be trained against.
          </li>
          <li>Only then, consider whether the estimate says anything useful about overtaking.</li>
        </ol>
        <p>The idea will probably change along the way.</p>
      </Section>
    </article>
  );
}
