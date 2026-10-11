import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

/** The h1 and optional intro text at the top of each page. */
export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="mb-10">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-[2.5rem] sm:leading-tight">
        {title}
      </h1>
      {children && <div className="mt-3 text-muted">{children}</div>}
    </header>
  );
}
