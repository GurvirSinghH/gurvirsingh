import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { getProject, type Project } from "../data/projects";
import { learning } from "../data/learning";
import { site } from "../data/site";
import { startHome } from "../lib/homeEffects";
import "./home.css";

/**
 * The project reel on the home page, in order. Titles, technologies and links come from
 * src/data/projects.ts; the short text, status badge and picture are set here.
 *
 *   motif  which drawing to show: "logs", "blender", "crawl" or "f1" (src/lib/homeEffects.ts)
 *   done   true shows a filled dot on the badge, false an open ring (still in progress)
 */
const REEL: {
  slug: string;
  title?: string;
  subtitle?: string;
  badge: string;
  done: boolean;
  motif: string;
  seed: number;
  meta?: string;
  blurb: string;
}[] = [
  {
    slug: "ai-log-intelligence-platform",
    badge: "Active development",
    done: false,
    motif: "logs",
    seed: 3,
    blurb:
      "A Streamlit app for analysing system log files. It parses Linux syslog, auth.log and Apache logs, flags unusual events with Isolation Forest, groups related anomalies with K-Means, and can draft an incident report with Gemini.",
  },
  {
    slug: "neural-forge",
    title: "Neural Forge",
    subtitle: "AI Blender assistant",
    badge: "Implemented · v1.0.0",
    done: true,
    motif: "blender",
    seed: 5,
    blurb:
      "A Blender add-on that writes Python scripts for Blender tasks. It works with Google Gemini, OpenAI, local models through Ollama, or any OpenAI-compatible API.",
  },
  {
    slug: "college-knowledge-base-crawler",
    badge: "Crawler built · RAG next",
    done: false,
    motif: "crawl",
    seed: 9,
    blurb:
      "A production-oriented crawler that collects pages and documents from a college website and prepares them as a dataset for a RAG pipeline. The crawler is done; the RAG pipeline comes next.",
  },
  {
    slug: "ghost-battery",
    badge: "Idea",
    done: false,
    motif: "f1",
    seed: 13,
    meta: "Physics-informed ML · Formula 1",
    blurb: "Exploring physics-informed machine learning for Formula 1 energy use and overtaking decisions.",
  },
];

const DISCIPLINES = [
  { name: "Anomaly detection", where: "AI Log Intelligence Platform" },
  { name: "LLM tooling", where: "Neural Forge" },
  { name: "Data collection", where: "College Knowledge Base Crawler" },
  { name: "Physics-informed ML", where: "Ghost Battery" },
];

function ProjectLink({ project }: { project: Project }) {
  if (project.github) {
    return (
      <a className="hm-more" href={project.github}>
        View repository<span className="sr-only">: {project.title}</span> <span aria-hidden="true">↗</span>
      </a>
    );
  }
  if (project.details) {
    return (
      <Link className="hm-more" to={project.details}>
        Read the idea<span className="sr-only">: {project.title}</span> <span aria-hidden="true">→</span>
      </Link>
    );
  }
  return null;
}

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const university = site.education.institution.split(",")[0];
  const reel = REEL.flatMap((item) => {
    const project = getProject(item.slug);
    return project ? [{ ...item, project }] : [];
  });
  const total = String(reel.length).padStart(2, "0");

  useEffect(() => {
    if (!rootRef.current) return;
    return startHome(rootRef.current);
  }, []);

  return (
    <div className="home" ref={rootRef}>
      <section className="hm-hero" aria-labelledby="home-title">
        <canvas className="hm-stream" data-hm="stream" aria-hidden="true" />
        <div className="hm-shade" aria-hidden="true" />
        <div className="hm-wrap hm-hero-in">
          <p className="hm-eyebrow">
            {site.name} &nbsp;/&nbsp; AI &amp; Data Science
          </p>
          <h1 id="home-title" className="hm-display">
            <span>Finding the</span>
            <span>
              <em>signal</em>
            </span>
            <span>in the noise.</span>
          </h1>
          <div className="hm-hero-foot">
            <p className="hm-lede">
              I build machine learning tools for messy real-world data, from log anomaly detection to
              LLM-driven Blender scripting. Right now I'm learning physics-informed machine learning.
            </p>
            <div className="hm-cta-row">
              <a className="hm-btn hm-btn-solid" href="#work">
                Selected work
              </a>
              <a className="hm-btn" href={site.cvUrl}>
                CV<span className="sr-only"> (PDF)</span> <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="hm-band" id="about" aria-label="About">
        <div className="hm-wrap hm-split">
          <p className="hm-eyebrow">About</p>
          <div className="hm-about-copy">
            <p className="hm-big">
              I enjoy learning how things work, building with what I learn, and solving problems along the
              way.{" "}
              <span className="hm-soft">
                Right now that means AI, machine learning, data science and physics-informed ML, plus a wider
                curiosity about where technology meets other fields.
              </span>
            </p>
            <p className="hm-edu">
              <b>{site.shortDegree}</b> &nbsp;·&nbsp; {university} &nbsp;·&nbsp; {site.education.year}
            </p>
          </div>
        </div>
      </section>

      <section className="hm-band hm-tight" aria-labelledby="home-work-on">
        <div className="hm-wrap">
          <div className="hm-disc-head">
            <h2 id="home-work-on" className="hm-eyebrow">
              What I work on
            </h2>
            <p className="hm-eyebrow" aria-hidden="true">
              Where it shows up
            </p>
          </div>
          <ul className="hm-disc">
            {DISCIPLINES.map((d) => (
              <li key={d.name}>
                <span className="hm-d-name">{d.name}</span>
                <span className="hm-d-where">
                  <b aria-hidden="true">→</b>
                  <span className="sr-only">Shows up in: </span>
                  {d.where}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hm-band hm-tight" id="work" aria-roledescription="carousel" aria-labelledby="home-built">
        <div className="hm-wrap hm-work-head">
          <div className="hm-titles">
            <p className="hm-eyebrow">Selected work</p>
            <h2 id="home-built" className="hm-section-title">
              Things I've built
            </h2>
          </div>
          <div className="hm-ctrl">
            <span className="hm-all">
              <Link className="hm-more" to="/projects">
                All projects <span aria-hidden="true">→</span>
              </Link>
            </span>
            <button type="button" data-hm="prev" aria-label="Previous project" disabled>
              Prev
            </button>
            <span className="hm-count" aria-live="polite">
              <span data-hm="cur">01</span> / {total}
            </span>
            <button type="button" data-hm="next" aria-label="Next project">
              Next
            </button>
          </div>
        </div>

        <div className="hm-reel" data-hm="reel" tabIndex={0} aria-label="Projects, scroll sideways">
          {reel.map(({ project, ...item }) => (
            <article key={item.slug} className="hm-slide" data-slide aria-roledescription="slide">
              <div className="hm-visual">
                <canvas data-motif={item.motif} data-seed={item.seed} aria-hidden="true" />
                <span className={`hm-status ${item.done ? "" : "hm-wip"}`}>{item.badge}</span>
              </div>
              <div className="hm-slide-body">
                <p className="hm-meta">{item.meta ?? project.technologies.join(" · ")}</p>
                <h3>
                  {item.title ?? project.title}
                  {item.subtitle && <small>{item.subtitle}</small>}
                </h3>
                <p>{item.blurb}</p>
                <ProjectLink project={project} />
              </div>
            </article>
          ))}
        </div>

        <div className="hm-wrap">
          <div className="hm-track" aria-hidden="true">
            <i data-hm="bar" />
          </div>
        </div>
      </section>

      <section className="hm-band hm-tight" id="learning" aria-labelledby="home-learning">
        <div className="hm-wrap hm-feature">
          <div className="hm-visual hm-tall">
            <canvas data-hm="piml" aria-hidden="true" />
            <span className="hm-status hm-wip">Learning</span>
          </div>
          <div className="hm-feature-copy">
            <h2 id="home-learning" className="hm-eyebrow">
              Currently learning
            </h2>
            <ul className="hm-learn">
              {learning.map((item) => (
                <li key={item.topic}>
                  <h3>{item.topic}</h3>
                  <p>{item.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="hm-band hm-contact" id="contact" aria-labelledby="home-contact">
        <div className="hm-wrap">
          <p className="hm-eyebrow">Contact</p>
          <h2 id="home-contact" className="hm-display">
            Let's build
            <br />
            something.
          </h2>
          <div className="hm-contact-row">
            <div className="hm-email">
              <span className="hm-k">Email</span>
              <a data-hm="email" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <button type="button" data-hm="copy">
                Copy
              </button>
            </div>
            <a className="hm-btn" href={site.github}>
              GitHub <span aria-hidden="true">↗</span>
            </a>
            {site.linkedin && (
              <a className="hm-btn" href={site.linkedin}>
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            )}
            <a className="hm-btn" href={site.cvUrl}>
              CV<span className="sr-only"> (PDF)</span> <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="hm-tz">
            India · IST <b data-hm="time">--:--</b> <span data-hm="date" />
          </p>
          <p className="hm-tz-note">My local time, if you're planning a call.</p>
        </div>
      </section>
    </div>
  );
}
