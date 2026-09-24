import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { externalWriting } from "../data/externalWriting";
import { site } from "../data/site";
import { posts } from "../lib/blog";

// Blog is only listed once there is something to read. The CV item opens the PDF
// directly when there is one, and the /cv page otherwise.
const navItems = [
  { to: "/projects", label: "Projects" },
  ...(posts.length > 0 || externalWriting.length > 0 ? [{ to: "/blog", label: "Blog" }] : []),
  { to: "/notes", label: "Research Notes" },
  { to: "/about", label: "About" },
  site.cvUrl ? { href: site.cvUrl, label: "CV" } : { to: "/cv", label: "CV" },
];

type NavItem = (typeof navItems)[number];

function navClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "text-ink underline decoration-1 underline-offset-[6px]"
    : "text-muted hover:text-accent";
}

function NavItemLink({ item, className = "" }: { item: NavItem; className?: string }) {
  if ("href" in item) {
    return (
      <a href={item.href} className={`${className} ${navClass({ isActive: false })}`}>
        {item.label}
      </a>
    );
  }
  return (
    <NavLink to={item.to} className={(s) => `${className} ${navClass(s)}`}>
      {item.label}
    </NavLink>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="border-b border-rule">
      <nav aria-label="Main" className="container-page">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="font-serif text-lg font-semibold text-ink hover:text-accent">
            {site.name}
          </Link>

          <ul className="hidden gap-7 sm:flex">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavItemLink item={item} />
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="-mr-2 p-2 text-ink hover:text-accent sm:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        <ul id="mobile-menu" hidden={!open} className="border-t border-rule py-2 sm:hidden">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavItemLink item={item} className="block py-2.5" />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
