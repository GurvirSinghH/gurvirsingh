import PageHeader from "../components/PageHeader";
import { learning } from "../data/learning";

export default function Learning() {
  return (
    <>
      <PageHeader title="Learning">
        <p>What I am learning right now.</p>
      </PageHeader>

      <ul>
        {learning.map((item) => (
          <li
            key={item.topic}
            className="grid gap-4 border-b border-rule py-9 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] sm:items-baseline sm:gap-10 sm:py-12"
          >
            <h2 className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.9] font-extrabold text-balance text-ink">
              {item.topic}
            </h2>
            <div className="max-w-xl">
              <p className="text-lg leading-relaxed text-muted">{item.note}</p>
              {item.link && (
                <p className="mt-4 font-mono text-[0.72rem] tracking-[0.12em] uppercase">
                  <a href={item.link.url} className="link">
                    {item.link.label}
                    <span className="sr-only">: {item.topic}</span> <span aria-hidden="true">↗</span>
                  </a>
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
