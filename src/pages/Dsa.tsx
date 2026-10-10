import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import SectionHeading from "../components/SectionHeading";
import { baselineProblems, dsa, leetcodeUrl, type DsaProblem, type DsaStatus } from "../data/dsa";
import { formatDate } from "../lib/formatDate";
import { fetchDsaProgress } from "../lib/dsaSheet";

type LoadState = "loading" | "live" | "unavailable" | "not-connected";

const isSolved = (p: DsaProblem) => p.status === "Solved" || p.status === "Re-solved";

/** "2026-10-12" → "12 Oct 2026". Parsed as UTC so the day never shifts. */
function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

function ProgressBar({
  value,
  label,
  className = "h-1.5",
}: {
  value: number;
  label: string;
  className?: string;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={`overflow-hidden rounded-full bg-rule ${className}`}
    >
      <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
    </div>
  );
}

const STATUS_LABELS: Record<DsaStatus, string> = {
  Solved: "Solved",
  "Re-solved": "Solved and revisited",
  Attempted: "Attempted",
  "Not started": "Not started",
};

/** A tick for solved problems; a ring (half filled once attempted) for the rest. */
function StatusMark({ status }: { status: DsaStatus }) {
  const solved = status === "Solved" || status === "Re-solved";
  return (
    <span className="flex w-4 shrink-0 justify-center pt-[0.45em]">
      {solved ? (
        <svg
          aria-hidden="true"
          width="13"
          height="13"
          viewBox="0 0 12 12"
          className="-mt-px text-accent"
        >
          <path
            d="M2 6.5l2.5 2.5L10 3"
            fill="none"
            stroke="currentColor"
            strokeWidth={status === "Re-solved" ? 2.25 : 1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span
          aria-hidden="true"
          className={`size-2.5 rounded-full border border-faint ${status === "Attempted" ? "" : "opacity-50"}`}
          style={
            status === "Attempted"
              ? { background: "linear-gradient(90deg, var(--color-faint) 50%, transparent 50%)" }
              : undefined
          }
        />
      )}
      <span className="sr-only">{STATUS_LABELS[status]}: </span>
    </span>
  );
}

function ProblemRow({ problem, showTopic = false }: { problem: DsaProblem; showTopic?: boolean }) {
  const solved = isSolved(problem);
  const meta = [
    showTopic ? problem.topic : null,
    problem.difficulty,
    problem.solvedOn ? shortDate(problem.solvedOn) : null,
    problem.status === "Re-solved" ? "revisited" : null,
  ].filter(Boolean);

  return (
    <li className="flex gap-3 py-2">
      <StatusMark status={problem.status} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <a
            href={leetcodeUrl(problem.name)}
            className={`hover:text-accent hover:underline ${solved ? "text-ink" : "text-muted"}`}
          >
            {problem.name}
            <span className="sr-only"> on LeetCode</span>
          </a>
          <span className="text-sm text-faint tabular-nums">{meta.join(" · ")}</span>
        </div>
        {solved && problem.note && (
          <p className="mt-0.5 text-[0.9375rem] text-muted">{problem.note}</p>
        )}
      </div>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-faint">{label}</dt>
      <dd className="mt-0.5 tabular-nums">{value}</dd>
    </div>
  );
}

export default function Dsa() {
  const [problems, setProblems] = useState<DsaProblem[]>(baselineProblems);
  const [state, setState] = useState<LoadState>(dsa.sheetId ? "loading" : "not-connected");

  // Progress is read in the browser, so the page is always as current as the spreadsheet.
  useEffect(() => {
    if (!dsa.sheetId) return;
    const controller = new AbortController();
    fetchDsaProgress(dsa.sheetId, controller.signal)
      .then((live) => {
        setProblems(live);
        setState("live");
      })
      .catch(() => {
        if (!controller.signal.aborted) setState("unavailable");
      });
    return () => controller.abort();
  }, []);

  const live = state === "live";
  const loading = state === "loading";
  const solved = problems.filter(isSolved);
  const count = (list: DsaProblem[]) => (loading ? "–" : String(list.length));
  const byDifficulty = (["Easy", "Medium", "Hard"] as const).map((difficulty) => {
    const all = problems.filter((p) => p.difficulty === difficulty);
    return { difficulty, all, solved: all.filter(isSolved) };
  });
  const revisited = problems.filter((p) => p.status === "Re-solved");
  const recent = solved
    .filter((p) => p.solvedOn)
    .sort((a, b) => (b.solvedOn! > a.solvedOn! ? 1 : b.solvedOn! < a.solvedOn! ? -1 : 0))
    .slice(0, 5);
  const lastSolved = recent[0]?.solvedOn;
  const topics = [...new Set(problems.map((p) => p.topic))];

  return (
    <>
      <PageHeader title="DSA Practice">
        <p>
          I am working through the{" "}
          <a href={dsa.listUrl} className="link">
            {dsa.listName}
          </a>
          , a list of {baselineProblems.length} coding problems covering the common patterns in
          technical interviews, alongside my machine learning projects.
          {state !== "not-connected" &&
            " This page reads from the spreadsheet I track them in, so it is always up to date."}{" "}
          Each solved problem has a one-line note on its key idea, in my own words.
        </p>
      </PageHeader>

      {state !== "not-connected" && (
        <section aria-label="Progress" aria-busy={loading} className="mb-14">
          {state !== "unavailable" && (
            <>
              <p className="font-serif text-2xl text-ink">
                <span className="font-semibold tabular-nums">{count(solved)}</span>
                <span className="text-muted"> of {problems.length} solved</span>
              </p>
              <ProgressBar
                value={loading ? 0 : solved.length / problems.length}
                label="Problems solved"
                className="mt-3 h-1.5"
              />

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                {byDifficulty.map(({ difficulty, all, solved: done }) => (
                  <Stat
                    key={difficulty}
                    label={difficulty}
                    value={`${count(done)} / ${all.length}`}
                  />
                ))}
                <Stat label="Revisited" value={count(revisited)} />
              </dl>
            </>
          )}

          <p className={`text-sm text-faint ${state === "unavailable" ? "" : "mt-6"}`}>
            Started <time dateTime={dsa.startedOn}>{formatDate(dsa.startedOn)}</time>
            {live && lastSolved && (
              <>
                {" · "}last solved <time dateTime={lastSolved}>{formatDate(lastSolved)}</time>
              </>
            )}
          </p>
          {state === "unavailable" && (
            <p className="mt-3 text-sm text-muted">
              My progress couldn't be loaded just now, so the list is shown without it.
            </p>
          )}
        </section>
      )}

      {live && recent.length > 0 && (
        <section aria-labelledby="recent" className="mb-14">
          <SectionHeading id="recent">Recently solved</SectionHeading>
          <ol className="divide-y divide-rule">
            {recent.map((p) => (
              <ProblemRow key={`${p.topic}-${p.name}`} problem={p} showTopic />
            ))}
          </ol>
        </section>
      )}

      <section aria-labelledby="all-problems">
        <SectionHeading
          id="all-problems"
          aside={<span className="text-faint">In study order</span>}
        >
          All problems
        </SectionHeading>
        <div>
          {topics.map((topic) => {
            const items = problems.filter((p) => p.topic === topic);
            const done = items.filter(isSolved).length;
            return (
              <details key={topic} className="group border-b border-rule">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 hover:text-accent [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-2.5">
                    <svg
                      aria-hidden="true"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      className="shrink-0 text-faint transition-transform group-open:rotate-90"
                    >
                      <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span className="font-serif font-semibold">{topic}</span>
                  </span>
                  <span className="flex items-center gap-3 text-sm text-faint">
                    {live && (
                      <ProgressBar
                        value={done / items.length}
                        label={`${topic}: problems solved`}
                        className="hidden h-1 w-16 sm:block"
                      />
                    )}
                    <span className="w-12 text-right tabular-nums">
                      {live ? `${done} / ${items.length}` : items.length}
                    </span>
                  </span>
                </summary>
                <ol className="pb-3 pl-[1.375rem]">
                  {items.map((p) => (
                    <ProblemRow key={p.name} problem={p} />
                  ))}
                </ol>
              </details>
            );
          })}
        </div>
      </section>
    </>
  );
}
