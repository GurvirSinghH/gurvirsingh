/**
 * Light/dark mode button.
 *
 * The site is light by default, whatever the system setting. This button turns dark mode
 * on (data-theme="dark" on <html>, remembered in localStorage) and off again; the inline
 * script in index.html applies a remembered choice before the page is drawn.
 *
 * The icon is picked with CSS (the `dark:` variant in index.css) rather than React
 * state, so the prerendered HTML already shows the right one.
 */

/** Must match the key read by the inline script in index.html. */
const STORAGE_KEY = "theme";

function toggleTheme() {
  const root = document.documentElement;
  const turnDarkOn = root.dataset.theme !== "dark";

  if (turnDarkOn) root.dataset.theme = "dark";
  else delete root.dataset.theme;

  try {
    if (turnDarkOn) localStorage.setItem(STORAGE_KEY, "dark");
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
      className={`p-2 text-ink transition-colors duration-150 hover:text-accent ${className}`}
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
