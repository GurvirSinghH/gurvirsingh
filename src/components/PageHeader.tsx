import type { ReactNode } from "react";
import { site } from "../data/site";

interface PageHeaderProps {
  title: string;
  /** Small label above the title. Defaults to the site owner's name. */
  eyebrow?: string;
  children?: ReactNode;
}

/** The oversized uppercase h1 and optional intro text at the top of each page. */
export default function PageHeader({ title, eyebrow = site.name, children }: PageHeaderProps) {
  return (
    <header className="mb-14 border-b border-rule pb-10 sm:mb-20 sm:pb-14">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-5 font-display text-[clamp(3rem,10vw,8.5rem)] leading-[0.84] font-extrabold text-balance text-ink">
        {title}
      </h1>
      {children && <div className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{children}</div>}
    </header>
  );
}
