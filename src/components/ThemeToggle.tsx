/**
 * Light/dark mode button.
 *
 * The site follows the system setting until this button is used. The choice is then
 * stored and set as data-theme="light" or "dark" on <html>; the inline script in
 * index.html applies a stored choice before the page is drawn. Choosing the system's
 * own theme again clears the stored choice, so the site follows the system again.
 *
 * The icon is picked with CSS (the `dark:` variant in index.css) rather than React
 * state, so the prerendered HTML already shows the right one.
 */

/** Must match the key read by the inline script in index.html. */
const STORAGE_KEY = "theme";

function toggleTheme() {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = root.dataset.theme ? root.dataset.theme === "dark" : systemDark;
  const next = isDark ? "light" : "dark";

  if ((next === "dark") === systemDark) {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = next;
  }

  try {
    if (root.dataset.theme) localStorage.setItem(STORAGE_KEY, next);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be blocked; the choice then lasts until the page is reloaded.
  }
}

const iconProps = {
  "aria-hidden": true,
  width: 19,
  height: 19,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export default function ThemeToggle({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 text-muted hover:text-accent ${className}`}
    >
      <span className="block dark:hidden">
        <svg {...iconProps}>
          <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7z" />
        </svg>
        <span className="sr-only">Switch to dark mode</span>
      </span>
      <span className="hidden dark:block">
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </svg>
        <span className="sr-only">Switch to light mode</span>
      </span>
    </button>
  );
}
