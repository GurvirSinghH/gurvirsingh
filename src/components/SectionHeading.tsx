import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  id?: string;
  /** Optional content aligned to the right of the heading, e.g. an "All projects" link. */
  aside?: ReactNode;
}

export default function SectionHeading({ children, id, aside }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-rule pb-3">
      <h2 id={id} className="font-display text-3xl leading-none font-bold text-balance text-ink sm:text-4xl">
        {children}
      </h2>
      {aside && <div className="font-mono text-[0.72rem] tracking-[0.12em] uppercase">{aside}</div>}
    </div>
  );
}
