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
      className={`overflow-hidden border border-rule-strong bg-page ${className}`}
    >
      <div className="h-full bg-cerulean" style={{ width: `${pct}%` }} />
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

function ProblemRow({ problem }: { problem: DsaProblem }) {
  const solved = isSolved(problem);
  const meta = [
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

const DIFFICULTY_TINTS = {
  Easy: "bg-tint-green",
  Medium: "bg-tint-yellow",
  Hard: "bg-tint-red",
} as const;

/** A solved problem as a card: topic on the label strip, my note, then difficulty and date. */
function ProblemCard({ problem }: { problem: DsaProblem }) {
  return (
    <li className="card card-lift">
      <p className={`card-label text-ink ${DIFFICULTY_TINTS[problem.difficulty]}`}>
        {problem.topic}
      </p>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="font-display text-2xl leading-[0.95] font-bold text-ink">
          <a href={leetcodeUrl(problem.name)} className="stretched-link hover:text-accent">
            {problem.name}
            <span className="sr-only"> on LeetCode</span>
          </a>
        </h4>
        {problem.note && (
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{problem.note}</p>
        )}
        <p className="card-rule mt-auto flex justify-between gap-4 pt-2 text-sm">
          <span>
            <span className="font-semibold">{problem.difficulty}</span>
            {problem.status === "Re-solved" && <span className="text-faint"> · revisited</span>}
          </span>
          {problem.solvedOn && (
            <time dateTime={problem.solvedOn} className="text-faint tabular-nums">
              {shortDate(problem.solvedOn)}
            </time>
          )}
        </p>
      </div>
    </li>
  );
}

/** A heading inside a section, smaller than SectionHeading and without its rule. */
function SubHeading({ id, aside, children }: { id: string; aside?: string; children: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h3 id={id} className="font-display text-2xl leading-none font-bold text-ink">
        {children}
      </h3>
      {aside && <span className="text-sm text-faint">{aside}</span>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-3 py-2">
      <dt className="font-mono text-[0.8125rem] text-faint">{label}</dt>
      <dd className="mt-1 font-display text-3xl leading-none font-bold tabular-nums">{value}</dd>
    </div>
  );
}

export default function Learning() {
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
      <PageHeader title="Learning">
        <p>Skills I am practising alongside my projects, and how far along I am.</p>
      </PageHeader>

      <section aria-labelledby="dsa">
        <SectionHeading
          id="dsa"
          aside={
            <a href={dsa.listUrl} className="link">
              The list<span className="sr-only"> on NeetCode</span>{" "}
              <span aria-hidden="true">↗</span>
            </a>
          }
        >
          DSA: {dsa.listName}
        </SectionHeading>
        <p className="mb-8 max-w-2xl">
          {baselineProblems.length} coding problems covering the common patterns in technical
          interviews.
          {state !== "not-connected" &&
            " This section reads from the spreadsheet I track them in, so it is always up to date."}{" "}
          Each solved problem has a one-line note on its key idea, in my own words.
        </p>

        {state !== "not-connected" && (
          <div aria-label="DSA progress" aria-busy={loading} className="mb-12">
            {state !== "unavailable" && (
              <>
                <p className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.9] font-extrabold text-ink">
                  <span className="font-semibold tabular-nums">{count(solved)}</span>
                  <span className="text-muted"> of {problems.length} solved</span>
                </p>
                <ProgressBar
                  value={loading ? 0 : solved.length / problems.length}
                  label="Problems solved"
                  className="mt-3 h-3"
                />

                <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
          </div>
        )}

        {live && recent.length > 0 && (
          <div className="mb-12">
            <SubHeading id="dsa-recent">Recently solved</SubHeading>
            <ol aria-labelledby="dsa-recent" className="card-grid">
              {recent.map((p) => (
                <ProblemCard key={`${p.topic}-${p.name}`} problem={p} />
              ))}
            </ol>
          </div>
        )}

        <SubHeading id="dsa-all" aside="In study order">
          All problems
        </SubHeading>
        <div aria-labelledby="dsa-all" role="group" className="card">
          {topics.map((topic) => {
            const items = problems.filter((p) => p.topic === topic);
            const done = items.filter(isSolved).length;
            return (
              <details key={topic} className="group card-rule px-4 first:border-t-0">
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
                    <span className="font-display text-xl leading-none font-bold">{topic}</span>
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
