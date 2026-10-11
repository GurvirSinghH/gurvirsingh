import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { externalWriting } from "../data/externalWriting";
import { site } from "../data/site";
import { posts } from "../lib/blog";
import ThemeToggle from "./ThemeToggle";

// Blog is only listed once there is something to read. The CV is a button at the right
// of the bar (it opens the PDF directly), so it is always visible, also on phones.
const navItems = [
  { to: "/projects", label: "Projects" },
  ...(posts.length > 0 || externalWriting.length > 0 ? [{ to: "/blog", label: "Blog" }] : []),
  { to: "/notes", label: "Research Notes" },
  { to: "/learning", label: "Learning" },
  { to: "/about", label: "About" },
];

type NavItem = (typeof navItems)[number];

// Links are plain text that turns the accent colour on hover; the current page is bold.
function navClass({ isActive }: { isActive: boolean }) {
  return `transition-colors duration-150 hover:text-accent ${isActive ? "font-bold text-ink" : "text-ink"}`;
}

function NavItemLink({ item, className = "" }: { item: NavItem; className?: string }) {
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
    <header className="sticky top-0 z-20 border-b border-rule bg-page">
      <nav aria-label="Main" className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            to="/"
            className="font-display text-lg font-bold tracking-tight whitespace-nowrap text-ink transition-colors duration-150 hover:text-accent"
          >
            {site.name}
          </Link>

          <div className="flex items-center gap-1 md:gap-3">
            <ul className="mr-2 hidden gap-6 md:flex">
              {navItems.map((item) => (
                <li key={item.label}>
                  <NavItemLink item={item} />
                </li>
              ))}
            </ul>

            <ThemeToggle />

            <a href={site.cvUrl} className="btn btn-primary ml-1 text-[0.9375rem]">
              CV<span className="sr-only"> (PDF)</span>
            </a>

            <button
              type="button"
              className="-mr-2 ml-1 p-2 text-ink hover:text-accent md:hidden"
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
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        <ul id="mobile-menu" hidden={!open} className="border-t border-rule py-2 md:hidden">
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
