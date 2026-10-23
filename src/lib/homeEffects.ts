/**
 * Browser-only behaviour of the home page (src/pages/Home.tsx): the canvas drawings,
 * the project reel's Prev/Next controls, the IST clock and the "Copy" email button.
 *
 * `startHome(root)` is called once from a useEffect and returns a cleanup function.
 * Elements are found by their `data-hm` attribute inside `root`. Colours come from the
 * --h-* variables in src/pages/home.css, and everything is redrawn when the light/dark
 * toggle changes data-theme on <html>. With reduced motion, each canvas is drawn once.
 */

type RGB = [number, number, number];
type Rand = () => number;
interface Canvas2D {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
}
interface Palette {
  /** text colour */
  P: RGB;
  /** neon rose: anomalies, flags */
  S: RGB;
  /** cerulean: physics, energy, clusters */
  B: RGB;
  /** panel background */
  I2: RGB;
}

const MONO = '"Geist Mono", ui-monospace, Menlo, monospace';
const TAU = Math.PI * 2;

function toRgb(value: string, fallback: RGB): RGB {
  const hex = value.trim().replace("#", "");
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
  if (!/^[0-9a-f]{6}$/i.test(full)) return fallback;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/** Small seeded random generator (mulberry32), so every drawing is the same each visit. */
function rng(seed: number): Rand {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: Rand): number {
  let u = 0;
  let v = 0;
  while (!u) u = r();
  while (!v) v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

/** Sizes a canvas to its box at the screen's pixel density. */
function prep(cv: HTMLCanvasElement): Canvas2D | null {
  const ctx = cv.getContext("2d");
  if (!ctx) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = cv.clientWidth;
  const h = cv.clientHeight;
  cv.width = Math.max(1, Math.round(w * dpr));
  cv.height = Math.max(1, Math.round(h * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

function grid(ctx: CanvasRenderingContext2D, w: number, h: number, step: number, P: RGB) {
  ctx.strokeStyle = rgba(P, 0.05);
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = step; x < w; x += step) {
    ctx.moveTo(Math.round(x) + 0.5, 0);
    ctx.lineTo(Math.round(x) + 0.5, h);
  }
  for (let y = step; y < h; y += step) {
    ctx.moveTo(0, Math.round(y) + 0.5);
    ctx.lineTo(w, Math.round(y) + 0.5);
  }
  ctx.stroke();
}

function tag(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  align: CanvasTextAlign = "left",
  keepCase = false,
) {
  ctx.font = `500 10px ${MONO}`;
  ctx.textAlign = align;
  if ("letterSpacing" in ctx) ctx.letterSpacing = keepCase ? "0px" : "1.5px";
  ctx.fillStyle = color;
  ctx.fillText(keepCase ? text : text.toUpperCase(), x, y);
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
  ctx.textAlign = "left";
}

function caption(c: Canvas2D, text: string, P: RGB) {
  tag(c.ctx, text, 16, c.h - 16, rgba(P, 0.5));
}

function curve(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(mx, y1, mx, y2, x2, y2);
  ctx.stroke();
}

/* ---------- project pictures ---------- */

type Motif = (c: Canvas2D, r: Rand, p: Palette) => void;

const motifs: Record<string, Motif> = {
  /** Log Intelligence: K-Means clusters with Isolation Forest outliers ringed. */
  logs(c, r, { P, S, B }) {
    const { ctx, w, h } = c;
    grid(ctx, w, h, 36, P);
    const centres: [number, number, number][] = [
      [0.34, 0.46, 0.075],
      [0.6, 0.6, 0.06],
      [0.5, 0.3, 0.05],
    ];
    for (let i = 0; i < 300; i++) {
      ctx.fillStyle = i % 3 === 1 ? rgba(B, 0.85) : rgba(P, 0.5);
      const [cx, cy, spread] = centres[i % 3];
      const x = (cx + gauss(r) * spread * 1.2) * w;
      const y = (cy + gauss(r) * spread * 1.3) * h;
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, TAU);
      ctx.fill();
    }
    let placed = 0;
    for (let guard = 0; placed < 8 && guard < 600; guard++) {
      const ux = 0.08 + r() * 0.84;
      const uy = 0.18 + r() * 0.62;
      if (centres.some(([cx, cy]) => Math.hypot(((ux - cx) * w) / h, uy - cy) < 0.26)) continue;
      const x = ux * w;
      const y = uy * h;
      ctx.fillStyle = rgba(S, 0.95);
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = rgba(S, 0.55);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, TAU);
      ctx.stroke();
      placed++;
    }
    caption(c, "Isolation Forest · K-Means", P);
  },

  /** Neural Forge: a prompt becomes a bpy script becomes a spiral of cubes. */
  blender(c, _r, { P, S, B, I2 }) {
    const { ctx, w, h } = c;
    grid(ctx, w, h, 36, P);
    const u = Math.max(0.45, Math.min(1, w / 760));
    const x0 = 20;
    const y0 = h * 0.26;
    const lh = Math.max(13, 18 * u);
    tag(ctx, '> "20 cubes in a rising spiral"', x0, y0, rgba(S, 0.95), "left", true);
    tag(ctx, "import bpy", x0, y0 + lh * 1.6, rgba(P, 0.6), "left", true);
    const bars: [number, number][] = [
      [0, 0.7], [0, 0.55], [1, 0.8], [1, 0.62], [2, 0.74], [2, 0.5], [1, 0.4], [0, 0.58], [1, 0.66],
    ];
    bars.forEach(([indent, frac], i) => {
      ctx.fillStyle = rgba(P, 0.2);
      ctx.fillRect(x0 + indent * 12, y0 + lh * (2.6 + i) - 4, w * 0.3 * frac, 2);
    });

    const ax = w * 0.44;
    const ay = h * 0.5;
    ctx.strokeStyle = rgba(B, 0.9);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(ax - 14, ay);
    ctx.lineTo(ax + 14, ay);
    ctx.moveTo(ax + 8, ay - 5);
    ctx.lineTo(ax + 14, ay);
    ctx.lineTo(ax + 8, ay + 5);
    ctx.stroke();

    const ox = w * 0.72;
    const oy = h * 0.58;
    ctx.strokeStyle = rgba(P, 0.07);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let k = -5; k <= 5; k++) {
      const d = k * 18 * u;
      const e = 90 * u;
      ctx.moveTo(ox + d * 0.87 - e * 0.87, oy + d * 0.5 + e * 0.5);
      ctx.lineTo(ox + d * 0.87 + e * 0.87, oy + d * 0.5 - e * 0.5);
      ctx.moveTo(ox - d * 0.87 - e * 0.87, oy + d * 0.5 - e * 0.5);
      ctx.lineTo(ox - d * 0.87 + e * 0.87, oy + d * 0.5 + e * 0.5);
    }
    ctx.stroke();

    const cubes = Array.from({ length: 20 }, (_, k) => {
      const angle = k * 0.62;
      const radius = (12 + k * 3.6) * u;
      return { x: ox + Math.cos(angle) * radius * 1.3, y: oy + Math.sin(angle) * radius * 0.62 - k * 3.4 * u, k };
    }).sort((a, b) => a.y - b.y || a.k - b.k);
    const s = 8 * u;
    for (const { x, y, k } of cubes) {
      const hi = k === 19;
      const top: [number, number][] = [[x, y - s * 0.5], [x + s * 0.87, y], [x, y + s * 0.5], [x - s * 0.87, y]];
      const left: [number, number][] = [[x - s * 0.87, y], [x, y + s * 0.5], [x, y + s * 1.5], [x - s * 0.87, y + s]];
      const right: [number, number][] = [[x + s * 0.87, y], [x, y + s * 0.5], [x, y + s * 1.5], [x + s * 0.87, y + s]];
      for (const [poly, a] of [[left, 0.04], [right, 0.08], [top, 0.14]] as const) {
        ctx.beginPath();
        poly.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
        ctx.closePath();
        ctx.fillStyle = rgba(I2, 1);
        ctx.fill();
        ctx.fillStyle = hi ? rgba(S, a * 2.5) : rgba(P, a);
        ctx.fill();
        ctx.strokeStyle = hi ? rgba(S, 0.95) : rgba(P, 0.45);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    caption(c, "Prompt → bpy script → scene", P);
  },

  /** Crawler: seed URL → pages and documents, with the queue still to fetch. */
  crawl(c, r, { P, S, I2 }) {
    const { ctx, w, h } = c;
    grid(ctx, w, h, 36, P);
    const root: [number, number] = [w * 0.1, h * 0.48];
    const x1 = w * 0.36;
    const x2 = w * 0.64;
    const x3 = w * 0.88;
    const leaves = 12;
    const ly = (j: number) => h * (0.16 + j * (0.62 / (leaves - 1)));
    const parents = [0, 1, 2, 3].map((p) => {
      const js = [p * 3, p * 3 + 1, p * 3 + 2];
      return { y: js.reduce((sum, j) => sum + ly(j), 0) / 3, js };
    });
    const docs = new Set([2, 5, 9]);
    const queued = [1, 4, 7, 10].map((j) => ({ j, y: ly(j) + (r() - 0.5) * 8 }));

    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(P, 0.22);
    for (const p of parents) {
      curve(ctx, root[0], root[1], x1, p.y);
      for (const j of p.js) curve(ctx, x1, p.y, x2, ly(j));
    }
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = rgba(S, 0.55);
    for (const q of queued) curve(ctx, x2, ly(q.j), x3, q.y);
    ctx.setLineDash([]);

    const node = (x: number, y: number, kind: "page" | "doc" | "queued") => {
      if (kind === "doc") {
        ctx.fillStyle = rgba(P, 0.75);
        ctx.fillRect(x - 3.5, y - 3.5, 7, 7);
      } else if (kind === "queued") {
        ctx.fillStyle = rgba(I2, 1);
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = rgba(S, 0.95);
        ctx.lineWidth = 1.4;
        ctx.stroke();
      } else {
        ctx.fillStyle = rgba(P, 0.75);
        ctx.beginPath();
        ctx.arc(x, y, 3.2, 0, TAU);
        ctx.fill();
      }
    };
    for (const p of parents) node(x1, p.y, "page");
    for (let j = 0; j < leaves; j++) node(x2, ly(j), docs.has(j) ? "doc" : "page");
    for (const q of queued) node(x3, q.y, "queued");
    ctx.fillStyle = rgba(S, 1);
    ctx.fillRect(root[0] - 5, root[1] - 5, 10, 10);
    tag(ctx, "Seed URL", root[0], root[1] - 16, rgba(P, 0.7), "center");
    tag(ctx, "● page   ■ document   ○ queued", w - 16, h - 16, rgba(P, 0.45), "right", true);
    caption(c, "Crawl → SQLite", P);
  },

  /** Ghost Battery: a circuit with the energy-hungry stretches lit up. */
  f1(c, _r, { P, B }) {
    const { ctx, w, h } = c;
    grid(ctx, w, h, 36, P);
    const cx = w * 0.48;
    const cy = h * 0.46;
    const R = Math.min(w / 1.7, h) * 0.32;
    const N = 360;
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * TAU;
      const k = 1 + 0.17 * Math.sin(3 * t + 0.6) + 0.07 * Math.cos(5 * t - 0.4);
      pts.push([cx + R * 1.6 * k * Math.cos(t), cy + R * k * Math.sin(t), t]);
    }
    const path = () => {
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    };
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    path();
    ctx.strokeStyle = rgba(P, 0.06);
    ctx.lineWidth = 12;
    ctx.stroke();
    path();
    ctx.strokeStyle = rgba(P, 0.32);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    for (let i = 0; i < N; i++) {
      const t = pts[i][2];
      const v = 0.5 + 0.5 * Math.sin(2 * t + 1.1) * Math.cos(0.5 * t + 0.3);
      if (v < 0.58) continue;
      ctx.strokeStyle = rgba(B, Math.min(1, (v - 0.58) / 0.3));
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(pts[i][0], pts[i][1]);
      ctx.lineTo(pts[i + 1][0], pts[i + 1][1]);
      ctx.stroke();
    }
    ctx.lineCap = "butt";
    const [sx, sy] = pts[0];
    ctx.strokeStyle = rgba(P, 0.9);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx - 9, sy);
    ctx.lineTo(sx + 9, sy);
    ctx.stroke();
    tag(ctx, "S/F", sx + 14, sy + 4, rgba(P, 0.7));
    caption(c, "Energy use · overtaking", P);
  },
};

/* ---------- the home page ---------- */

export function startHome(root: HTMLElement): () => void {
  const html = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cleanups: (() => void)[] = [];
  const find = <T extends Element>(name: string) => root.querySelector<T>(`[data-hm="${name}"]`);

  let pal: Palette = { P: [242, 242, 242], S: [255, 45, 149], B: [0, 123, 167], I2: [20, 20, 22] };
  function readPalette() {
    const cs = getComputedStyle(root);
    pal = {
      P: toRgb(cs.getPropertyValue("--h-fg"), pal.P),
      S: toRgb(cs.getPropertyValue("--h-signal"), pal.S),
      B: toRgb(cs.getPropertyValue("--h-cool"), pal.B),
      I2: toRgb(cs.getPropertyValue("--h-bg2"), pal.I2),
    };
  }

  /* --- project pictures --- */
  const motifCanvases = [...root.querySelectorAll<HTMLCanvasElement>("canvas[data-motif]")];
  function drawMotifs() {
    for (const cv of motifCanvases) {
      const draw = motifs[cv.dataset.motif ?? ""];
      const c = prep(cv);
      if (!draw || !c || c.w < 2) continue;
      draw(c, rng(Number(cv.dataset.seed) || 1), pal);
    }
  }

  /* --- hero: drifting log lines, a few flagged --- */
  const streamCv = find<HTMLCanvasElement>("stream");
  interface Row {
    y: number;
    speed: number;
    cool: boolean;
    items: { x: number; len: number; a: number; flag: boolean }[];
  }
  let stream: (Canvas2D & { rows: Row[]; W: number }) | null = null;

  function buildStream() {
    const c = streamCv ? prep(streamCv) : null;
    if (!c) return;
    const r = rng(7);
    const gap = 13;
    const W = c.w + 240;
    const rows: Row[] = [];
    for (let y = gap / 2; y < c.h; y += gap) {
      const speed = 6 + r() * 40;
      const items: Row["items"] = [];
      let x = r() * 60;
      while (x < W) {
        const flag = r() < 0.007;
        const len = flag ? 18 + r() * 40 : 3 + Math.pow(r(), 1.6) * 90;
        items.push({ x, len, a: 0.04 + r() * 0.18 + speed / 420, flag });
        x += len + 5 + r() * 46;
      }
      rows.push({ y: Math.round(y) + 0.5, speed, items, cool: r() < 0.14 });
    }
    stream = { ...c, rows, W };
  }

  function corners(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, s: number) {
    ctx.beginPath();
    ctx.moveTo(x, y + s);
    ctx.lineTo(x, y);
    ctx.lineTo(x + s, y);
    ctx.moveTo(x + w - s, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + s);
    ctx.moveTo(x + w, y + h - s);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w - s, y + h);
    ctx.moveTo(x + s, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + h - s);
    ctx.stroke();
  }

  function drawStream(t: number) {
    if (!stream) return;
    const { ctx, w, h, rows, W } = stream;
    const { P, S, B } = pal;
    ctx.clearRect(0, 0, w, h);
    ctx.font = `500 9px ${MONO}`;
    for (const row of rows) {
      const off = t * row.speed;
      for (const it of row.items) {
        const x = (((it.x - off) % W) + W) % W - 120;
        if (x > w || x + it.len < 0) continue;
        if (it.flag) {
          ctx.fillStyle = rgba(S, 0.14);
          ctx.fillRect(x - 4, row.y - 5, it.len + 8, 10);
          ctx.fillStyle = rgba(S, 0.95);
          ctx.fillRect(x, row.y - 1, it.len, 2);
          ctx.strokeStyle = rgba(S, 0.7);
          ctx.lineWidth = 1;
          corners(ctx, x - 8, row.y - 8, it.len + 16, 16, 4);
          ctx.fillStyle = rgba(S, 0.85);
          ctx.fillText("FLAG", x + it.len + 14, row.y + 3.5);
        } else {
          ctx.fillStyle = row.cool ? rgba(B, Math.min(1, it.a * 2.4)) : rgba(P, it.a);
          ctx.fillRect(x, row.y - 0.5, it.len, 1);
        }
      }
    }
  }

  /* --- currently learning: a data-only fit drifts, the physics term pulls it back --- */
  const pimlCv = find<HTMLCanvasElement>("piml");
  let piml: Canvas2D | null = null;
  const truth = (t: number) => Math.exp(-2.2 * t) * Math.cos(18 * t);
  const observations = (() => {
    const r = rng(17);
    return Array.from({ length: 6 }, (_, i) => {
      const t = 0.02 + i * 0.046;
      return [t, truth(t) + (r() - 0.5) * 0.08] as const;
    });
  })();

  function drawPiml(p: number) {
    if (!piml) return;
    const { ctx, w, h } = piml;
    const { P, S, B } = pal;
    ctx.clearRect(0, 0, w, h);
    grid(ctx, w, h, 32, P);
    const pad = 22;
    const mid = h * 0.5;
    const amp = h * 0.3;
    const td = 0.27;
    const top = Math.max(h * 0.12, 52);
    const bot = h * 0.84;
    const X = (t: number) => pad + t * (w - pad * 2);
    const Y = (v: number) => mid - v * amp;
    const model = (t: number) =>
      truth(t) + (1 - p) * (t > td ? Math.pow((t - td) / (1 - td), 1.3) * 0.95 * Math.sin(9 * t + 0.4) : 0);

    ctx.fillStyle = rgba(B, 0.09);
    ctx.fillRect(X(td), top, X(1) - X(td), bot - top);
    ctx.strokeStyle = rgba(B, 0.5);
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(X(td) + 0.5, top);
    ctx.lineTo(X(td) + 0.5, bot);
    ctx.stroke();
    ctx.setLineDash([]);
    tag(ctx, "Physics constraint", X(td) + 10, top + 16, rgba(B, 1));
    tag(ctx, "Data", X(0.02), bot - 6, rgba(P, 0.6));

    ctx.strokeStyle = rgba(P, 0.14);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, mid + 0.5);
    ctx.lineTo(w - pad, mid + 0.5);
    ctx.stroke();

    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = rgba(P, 0.32);
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const t = i / 300;
      if (i) ctx.lineTo(X(t), Y(truth(t)));
      else ctx.moveTo(X(t), Y(truth(t)));
    }
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = rgba(S, 0.95);
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const t = i / 300;
      const v = Math.max(-1.5, Math.min(1.5, model(t)));
      if (i) ctx.lineTo(X(t), Y(v));
      else ctx.moveTo(X(t), Y(v));
    }
    ctx.stroke();

    for (const [t, v] of observations) {
      ctx.strokeStyle = rgba(P, 0.5);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(X(t), Y(v) - 6);
      ctx.lineTo(X(t), Y(v) + 6);
      ctx.stroke();
      ctx.fillStyle = rgba(P, 0.95);
      ctx.beginPath();
      ctx.arc(X(t), Y(v), 3, 0, TAU);
      ctx.fill();
    }

    const bw = Math.min(110, w * 0.26);
    const bx = w - pad - bw;
    const by = h - 22;
    ctx.fillStyle = rgba(P, 0.12);
    ctx.fillRect(bx, by, bw, 3);
    ctx.fillStyle = rgba(B, 1);
    ctx.fillRect(bx, by, bw * p, 3);
    tag(ctx, "Physics weight", bx + bw, by - 7, rgba(P, 0.5), "right");
    caption(piml, "Damped oscillator · sketch", P);
  }

  const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
  function pimlPhase(s: number): number {
    const c = s % 9;
    if (c < 5) return ease(c / 5);
    if (c < 7.5) return 1;
    return 1 - ease((c - 7.5) / 1.5);
  }

  /* --- drawing and animation --- */
  const t0 = performance.now();
  let streamVisible = true;
  let pimlVisible = false;

  function setup() {
    readPalette();
    buildStream();
    drawMotifs();
    piml = pimlCv ? prep(pimlCv) : null;
    const s = reduce ? 14 : (performance.now() - t0) / 1000;
    drawStream(s);
    drawPiml(reduce ? 1 : pimlPhase(s));
  }
  setup();

  if (!reduce) {
    const observers = [
      [streamCv, (v: boolean) => (streamVisible = v)],
      [pimlCv, (v: boolean) => (pimlVisible = v)],
    ] as const;
    for (const [el, set] of observers) {
      if (!el) continue;
      const io = new IntersectionObserver((entries) => entries.forEach((e) => set(e.isIntersecting)));
      io.observe(el);
      cleanups.push(() => io.disconnect());
    }
    let raf = 0;
    const frame = (now: number) => {
      const s = (now - t0) / 1000;
      if (streamVisible) drawStream(s);
      if (pimlVisible) drawPiml(pimlPhase(s));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    cleanups.push(() => cancelAnimationFrame(raf));
  }

  // Fonts used in the canvas labels may arrive after the first drawing.
  document.fonts?.ready.then(() => {
    if (root.isConnected) drawMotifs();
  });

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      setup();
      syncReel();
    }, 150);
  };
  window.addEventListener("resize", onResize);
  cleanups.push(() => {
    window.removeEventListener("resize", onResize);
    window.clearTimeout(resizeTimer);
  });

  // Redraw in the new colours when the light/dark toggle is used.
  const themeObserver = new MutationObserver(setup);
  themeObserver.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
  cleanups.push(() => themeObserver.disconnect());

  /* --- project reel: Prev / Next, counter and progress line --- */
  const reel = find<HTMLElement>("reel");
  const prev = find<HTMLButtonElement>("prev");
  const next = find<HTMLButtonElement>("next");
  const cur = find<HTMLElement>("cur");
  const bar = find<HTMLElement>("bar");
  const slides = reel ? [...reel.querySelectorAll<HTMLElement>("[data-slide]")] : [];
  let index = 0;

  const padLeft = () =>
    reel ? parseFloat(getComputedStyle(reel).scrollPaddingLeft) || parseFloat(getComputedStyle(reel).paddingLeft) || 0 : 0;

  function syncReel() {
    if (!reel || slides.length === 0) return;
    const max = reel.scrollWidth - reel.clientWidth;
    const p = padLeft();
    const left = reel.scrollLeft;
    let best = 0;
    let bestDistance = Infinity;
    slides.forEach((s, k) => {
      const d = Math.abs(s.offsetLeft - p - left);
      if (d < bestDistance) {
        bestDistance = d;
        best = k;
      }
    });
    if (max > 4 && left >= max - 4) best = slides.length - 1;
    index = best;
    if (cur) cur.textContent = String(index + 1).padStart(2, "0");
    if (prev) prev.disabled = left <= 4;
    if (next) next.disabled = left >= max - 4;
    if (bar) {
      const visible = Math.min(1, reel.clientWidth / reel.scrollWidth);
      bar.style.width = `${visible * 100}%`;
      bar.style.transform = `translateX(${(left / reel.scrollWidth / visible) * 100}%)`;
    }
  }

  function goTo(k: number) {
    if (!reel || slides.length === 0) return;
    const target = slides[Math.max(0, Math.min(slides.length - 1, k))];
    reel.scrollTo({ left: target.offsetLeft - padLeft(), behavior: reduce ? "auto" : "smooth" });
  }

  if (reel) {
    const onPrev = () => goTo(index - 1);
    const onNext = () => goTo(index + 1);
    const onScroll = () => requestAnimationFrame(syncReel);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      }
    };
    prev?.addEventListener("click", onPrev);
    next?.addEventListener("click", onNext);
    reel.addEventListener("scroll", onScroll, { passive: true });
    reel.addEventListener("keydown", onKey);
    cleanups.push(() => {
      prev?.removeEventListener("click", onPrev);
      next?.removeEventListener("click", onNext);
      reel.removeEventListener("scroll", onScroll);
      reel.removeEventListener("keydown", onKey);
    });
    syncReel();
  }

  /* --- local time in India --- */
  const clockTime = find<HTMLElement>("time");
  const clockDate = find<HTMLElement>("date");
  const tick = () => {
    const now = new Date();
    if (clockDate) {
      clockDate.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "long",
      }).format(now);
    }
    if (clockTime) {
      clockTime.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(now);
    }
  };
  tick();
  const clock = window.setInterval(tick, 15000);
  cleanups.push(() => window.clearInterval(clock));

  /* --- copy the email address --- */
  const copyButton = find<HTMLButtonElement>("copy");
  const email = find<HTMLElement>("email");
  let copyTimer = 0;
  const onCopy = () => {
    if (!copyButton || !email) return;
    const show = (label: string) => {
      copyButton.textContent = label;
      window.clearTimeout(copyTimer);
      copyTimer = window.setTimeout(() => (copyButton.textContent = "Copy"), 1800);
    };
    const selectInstead = () => {
      const range = document.createRange();
      range.selectNodeContents(email);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      show("Selected");
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email.textContent?.trim() ?? "").then(() => show("Copied"), selectInstead);
    } else {
      selectInstead();
    }
  };
  copyButton?.addEventListener("click", onCopy);
  cleanups.push(() => {
    copyButton?.removeEventListener("click", onCopy);
    window.clearTimeout(copyTimer);
  });

  return () => cleanups.forEach((fn) => fn());
}
