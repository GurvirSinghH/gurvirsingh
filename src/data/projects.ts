/**
 * All projects shown on the site.
 *
 * To add a project, add an object to the `projects` array. Projects appear on
 * the Projects page in their `section`, in the order they are listed here.
 * Only fill in links that actually exist — the UI shows a link only when
 * its field is set.
 *
 *   section  "selected"    → Selected Work
 *            "other"       → Other Projects
 *            "exploration" → Exploration (ideas, not built projects)
 *   technologies  Tools actually used. Leave empty (e.g. for an idea) to
 *            hide the Technology row.
 *   github   Repository URL. Omit if there is no repository.
 *   demo     Live demo URL. Omit if there is no live demo.
 *   video    Demo video URL. Omit if there is no video.
 *   image    Screenshot or GIF shown on the Projects page (Selected Work), e.g.
 *            { src: "/images/projects/log-platform.png", alt: "Dashboard with…" }.
 *            Put the file in public/images/projects/. Omit if there is none.
 *   details  Internal route to a details page, e.g. "/projects/ghost-battery".
 *            The page component must also be registered in
 *            src/pages/project-details/index.tsx.
 */

export type ProjectSection = "selected" | "other" | "exploration";

export interface Project {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  technologies: string[];
  github?: string;
  demo?: string;
  video?: string;
  image?: { src: string; alt: string };
  details?: string;
  status: string;
  section: ProjectSection;
}

export const projects: Project[] = [
  // ── Selected Work ──────────────────────────────────────────────────────────
  {
    slug: "ai-log-intelligence-platform",
    title: "AI Log Intelligence Platform",
    description:
      "A Streamlit application for analyzing system log files. It parses logs into structured entries, provides statistics and visualizations, performs anomaly detection with Isolation Forest, and groups unusual entries using K-Means. It can optionally draft an incident report with Google Gemini.",
    technologies: ["Python", "Streamlit", "Pandas", "Scikit-learn", "Plotly", "Gemini API"],
    github: "https://github.com/GurvirSinghH/AI-Log-Intelligence-Platform",
    // TODO: add a screenshot or GIF: image: { src: "/images/projects/….png", alt: "…" },
    status: "Active development",
    section: "selected",
  },
  {
    // The repository is "neural-forge"; its README is titled "AI Blender Assistant".
    slug: "neural-forge",
    // TODO: add a screenshot or GIF: image: { src: "/images/projects/….png", alt: "…" },
    title: "Neural Forge (AI Blender Assistant)",
    description:
      "A Blender add-on that generates Python scripts for Blender tasks using Google Gemini, OpenAI, Ollama (local models) or any OpenAI-compatible API. It can include scene context in the prompt, auto-execute generated scripts, and ask the model to fix a script that fails. Generated scripts are kept in a history with View, Run and Copy actions, and a Quick Prompts panel offers example prompts.",
    technologies: ["Python", "Blender Python API", "LLM APIs"],
    github: "https://github.com/GurvirSinghH/neural-forge",
    status: "Implemented (version 1.0.0)",
    section: "selected",
  },
  {
    slug: "college-knowledge-base-crawler",
    title: "College Knowledge Base Crawler",
    description:
      "A production-oriented crawler that collects pages and documents from a college website and prepares them as a dataset for a future RAG pipeline. It respects robots.txt, crawls concurrently with retries and backoff, extracts structured page content and metadata, downloads linked documents, and stores crawl information in SQLite.",
    technologies: ["Python", "Requests", "BeautifulSoup", "lxml", "SQLite", "YAML"],
    github: "https://github.com/GurvirSinghH/college-rag-assistant",
    // TODO: add a screenshot or GIF: image: { src: "/images/projects/….png", alt: "…" },
    status: "Crawler implemented; RAG pipeline not built yet",
    section: "selected",
  },

  // ── Other Projects ─────────────────────────────────────────────────────────
  {
    slug: "code-editor",
    title: "CodeEditor",
    description:
      "A Java Swing desktop code editor with MySQL integration over JDBC. It supports multi-tab editing, syntax highlighting for Java, Python and HTML, a snippets manager, a recent files list, and session restore.",
    technologies: ["Java", "Swing", "MySQL", "JDBC"],
    github: "https://github.com/GurvirSinghH/CodeEditor",
    status: "2nd-year project",
    section: "other",
  },
  {
    slug: "csv-cleaner",
    title: "CSV Cleaner",
    description:
      "A Python data-cleaning and automation tool for CSV and Excel files. It fixes common issues such as duplicate rows, inconsistent dates and casing, and invalid values; writes a formatted Excel file with a report of the changes; can optionally email the results; and includes a folder watcher that cleans new files automatically.",
    technologies: ["Python", "Pandas", "openpyxl", "watchdog", "Rich"],
    github: "https://github.com/GurvirSinghH/csv-cleaner",
    status: "Implemented",
    section: "other",
  },
  {
    slug: "ml-lab",
    title: "ML Lab",
    description:
      "Jupyter notebooks from machine learning lab practicals: synthetic data generation, data processing, linear and logistic regression, and exploratory analyses of the Titanic and Online Retail datasets.",
    technologies: ["Python", "Jupyter", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Seaborn"],
    github: "https://github.com/GurvirSinghH/MLlab",
    status: "Academic coursework",
    section: "other",
  },

  // ── Exploration ────────────────────────────────────────────────────────────
  {
    slug: "ghost-battery",
    title: "Ghost Battery",
    subtitle: "Exploring physics-informed ML for Formula 1 energy use and overtaking decisions.",
    description:
      "An idea I am exploring as I learn physics-informed machine learning: estimating a Formula 1 car's hidden electrical energy state from public telemetry by combining physics-based models with machine learning, and using that estimate to reason about the energy cost and value of overtaking.",
    // Not built yet: no technologies used and no repository. Possible tools are
    // discussed on the idea page (src/pages/project-details/GhostBattery.tsx).
    technologies: [],
    details: "/projects/ghost-battery",
    status: "Idea / exploration — not built yet",
    section: "exploration",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
