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
            <p className="max-w-xl text-lg leading-relaxed text-muted">{item.note}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
