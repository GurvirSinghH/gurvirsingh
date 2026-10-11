import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  id?: string;
  /** Optional content aligned to the right of the heading, e.g. an "All projects" link. */
  aside?: ReactNode;
}

export default function SectionHeading({ children, id, aside }: SectionHeadingProps) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-rule pb-2">
      <h2 id={id} className="font-display text-xl font-bold tracking-tight text-ink">
        {children}
      </h2>
      {aside && <div className="text-sm">{aside}</div>}
    </div>
  );
}
