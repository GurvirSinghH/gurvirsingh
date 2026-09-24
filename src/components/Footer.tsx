import { site } from "../data/site";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-rule">
      <div className="container-page flex flex-wrap justify-between gap-x-6 gap-y-2 py-8 text-sm text-faint">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="flex flex-wrap gap-x-4">
          <a href={`mailto:${site.email}`} className="link">
            {site.email}
          </a>
          <a href={site.github} className="link">
            GitHub
          </a>
          {site.linkedin && (
            <a href={site.linkedin} className="link">
              LinkedIn
            </a>
          )}
        </p>
      </div>
    </footer>
  );
}
