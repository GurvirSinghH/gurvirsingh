/**
 * Reads my DSA progress from the "Tracker" tab of a Google Sheet shared as
 * "Anyone with the link: Viewer". Uses the sheet's public CSV output, so no API key is needed.
 *
 * Tracker columns: A #, B Topic, C Problem, D Difficulty, E Link, F Status,
 * G Date Solved, H Date Re-solved, I Key idea, J Note.
 */

import { dsa, type Difficulty, type DsaProblem, type DsaStatus } from "../data/dsa";

// Columns B, C, D, F, G, H, I, with the two date columns returned as YYYY-MM-DD.
const QUERY = "select B, C, D, F, G, H, I format G 'yyyy-MM-dd', H 'yyyy-MM-dd'";

function sheetCsvUrl(sheetId: string): string {
  const params = new URLSearchParams({
    tqx: "out:csv",
    headers: "1",
    sheet: dsa.sheetTab,
    tq: QUERY,
  });
  return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/gviz/tq?${params}`;
}

/** Splits CSV text into rows of fields, handling quoted fields with commas, quotes and newlines. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const STATUSES: DsaStatus[] = ["Not started", "Attempted", "Solved", "Re-solved"];
const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "2026-10-10", "10-Oct-2026" or "10/10/2026" (day first) → "2026-10-10"; anything else → null. */
export function toIsoDate(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  const pad = (n: number) => String(n).padStart(2, "0");

  let m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${pad(+m[2])}-${pad(+m[3])}`;

  m = v.match(/^(\d{1,2})[-\s]([A-Za-z]{3})[A-Za-z]*[-\s,]+(\d{4})$/);
  if (m) {
    const month = MONTHS.indexOf(m[2].toLowerCase()) + 1;
    if (month > 0) return `${m[3]}-${pad(month)}-${pad(+m[1])}`;
  }

  m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${pad(+m[2])}-${pad(+m[1])}`;

  return null;
}

/** Turns the sheet's CSV into problems. Rows without a problem name are skipped. */
export function problemsFromCsv(text: string): DsaProblem[] {
  const [, ...rows] = parseCsv(text);
  const problems: DsaProblem[] = [];

  for (const [
    topic = "",
    name = "",
    difficulty = "",
    status = "",
    solved = "",
    resolved = "",
    note = "",
  ] of rows) {
    if (!name.trim()) continue;
    problems.push({
      topic: topic.trim() || "Other",
      name: name.trim(),
      difficulty: (DIFFICULTIES.find((d) => d.toLowerCase() === difficulty.trim().toLowerCase()) ??
        "Medium") as Difficulty,
      status:
        STATUSES.find((s) => s.toLowerCase() === status.trim().toLowerCase()) ?? "Not started",
      solvedOn: toIsoDate(solved),
      resolvedOn: toIsoDate(resolved),
      note: note.trim(),
    });
  }
  return problems;
}

/** Fetches the current progress. Throws if the sheet can't be read (not shared, offline, …). */
export async function fetchDsaProgress(
  sheetId: string,
  signal?: AbortSignal,
): Promise<DsaProblem[]> {
  const response = await fetch(sheetCsvUrl(sheetId), { signal });
  if (!response.ok) throw new Error(`Sheet request failed (${response.status})`);
  const text = await response.text();
  if (text.trimStart().startsWith("<")) throw new Error("Sheet is not shared publicly");
  const problems = problemsFromCsv(text);
  if (problems.length === 0) throw new Error("Sheet has no problems");
  return problems;
}
