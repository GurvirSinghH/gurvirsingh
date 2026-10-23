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
  { to: "/notes", label: "Notes" },
  { to: "/learning", label: "Learning" },
  { to: "/about", label: "About" },
];

type NavItem = (typeof navItems)[number];

// Small uppercase links; the current page is bright with a neon-rose underline.
function navClass({ isActive }: { isActive: boolean }) {
  return `font-mono text-[0.72rem] uppercase tracking-[0.16em] transition-colors duration-150 hover:text-ink ${
    isActive ? "text-ink underline decoration-signal decoration-2 underline-offset-[7px]" : "text-muted"
  }`;
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
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  // On the home page the bar sits transparently over the hero until the page scrolls.
  const overHero = isHome && !scrolled && !open;

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 border-b transition-colors duration-300 ${isHome ? "-mb-[4.5rem]" : ""} ${
        overHero ? "border-transparent bg-transparent" : "border-rule bg-page/85 backdrop-blur-md"
      }`}
    >
      <nav aria-label="Main" className="container-page">
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-3.5 whitespace-nowrap" aria-label={`${site.name}, home`}>
            <span className="border border-rule-strong px-2 pt-[5px] pb-[3px] font-display text-xl leading-none font-extrabold text-ink transition-colors duration-150 group-hover:border-ink">
              GS
            </span>
            <span className="eyebrow hidden text-muted sm:inline">{site.name}</span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <ul className="mr-4 hidden gap-7 md:flex">
              {navItems.map((item) => (
                <li key={item.label}>
                  <NavItemLink item={item} />
                </li>
              ))}
            </ul>

            <ThemeToggle />

            <a href={site.cvUrl} className="btn btn-primary px-3.5 py-2.5 text-[0.7rem]">
              CV<span className="sr-only"> (PDF)</span>
            </a>

            <button
              type="button"
              className="grid size-9 place-items-center border border-rule-strong text-muted hover:border-ink hover:text-ink md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <svg
                aria-hidden="true"
                width="18"
                height="18"
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

        <ul id="mobile-menu" hidden={!open} className="border-t border-rule py-3 md:hidden">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavItemLink item={item} className="block py-3" />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
