import type { ReactNode } from "react";
import { Link } from "react-router";

interface LinkButtonProps {
  /** Internal route ("/projects"), external URL ("https://…") or file path. */
  href: string;
  children: ReactNode;
  /** Extra text for screen readers, e.g. the project name, so "GitHub" links are distinguishable. */
  context?: string;
  /** Set for file downloads such as the CV PDF. */
  download?: boolean;
}

const style =
  "inline-flex items-center gap-1 rounded-sm border border-rule px-2.5 py-1 text-sm leading-6 whitespace-nowrap text-accent hover:border-accent hover:text-accent-hover";

export default function LinkButton({ href, children, context, download }: LinkButtonProps) {
  const srContext = context ? <span className="sr-only"> — {context}</span> : null;
  const isInternal = href.startsWith("/") && !download;

  if (isInternal) {
    return (
      <Link to={href} className={style}>
        {children}
        {srContext}
      </Link>
    );
  }

  const isExternal = /^https?:\/\//.test(href);
  return (
    <a href={href} className={style} download={download || undefined}>
      {children}
      {srContext}
      {isExternal && (
        <span aria-hidden="true" className="text-xs">
          ↗
        </span>
      )}
    </a>
  );
}
