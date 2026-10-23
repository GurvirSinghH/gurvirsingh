import { useLocation } from "react-router";
import { site } from "../data/site";

export default function Footer() {
  // The home page ends with its own Contact band, so the footer follows it directly.
  const { pathname } = useLocation();

  return (
    <footer className={`border-t border-rule ${pathname === "/" ? "" : "mt-28"}`}>
      <div className="container-page flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-8 font-mono text-[0.7rem] tracking-[0.14em] text-faint uppercase">
        {/* Rendered at build time, so the year can differ from the browser's until a rebuild. */}
        <p suppressHydrationWarning>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={`mailto:${site.email}`} className="tracking-[0.04em] normal-case hover:text-ink">
            {site.email}
          </a>
          <a href={site.github} className="hover:text-ink">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          {site.linkedin && (
            <a href={site.linkedin} className="hover:text-ink">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          )}
          <a href="#" className="hover:text-ink">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </p>
      </div>
    </footer>
  );
}
