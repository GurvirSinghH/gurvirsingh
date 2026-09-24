/*
 * Runs after `vite build` and `vite build --ssr` (see "build" in package.json).
 *
 * Writes a static HTML file for every page, with that page's content and its own
 * title, description, canonical URL and Open Graph tags, so links shared on
 * social sites preview correctly and search engines see the content:
 *
 *   /                 → dist/index.html
 *   /projects         → dist/projects.html        (served as /projects; see vercel.json)
 *   /notes/<slug>     → dist/notes/<slug>.html
 *   unknown paths     → dist/404.html
 *
 * Also writes dist/sitemap.xml and dist/robots.txt.
 */

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssrDir = join(root, "dist-ssr");

const { render, pageMeta, notFoundMeta, prerenderPaths, sitemapPaths, siteUrl, siteName } = await import(
  pathToFileURL(join(ssrDir, "entry-server.js")).href
);

const template = await readFile(join(dist, "index.html"), "utf8");
const META_BLOCK = /<!--page-meta:start-->[\s\S]*?<!--page-meta:end-->/;
if (!META_BLOCK.test(template) || !template.includes("<!--app-html-->")) {
  throw new Error("index.html is missing the <!--page-meta:…--> or <!--app-html--> markers.");
}

const escape = (text) =>
  text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function headTags({ title, description }, path) {
  const url = path === null ? null : siteUrl + (path === "/" ? "/" : path);
  const image = `${siteUrl}/og-image.png`;
  return [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    url && `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${path?.split("/").length > 2 ? "article" : "website"}" />`,
    `<meta property="og:site_name" content="${escape(siteName)}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    url && `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    path === null && `<meta name="robots" content="noindex" />`,
  ]
    .filter(Boolean)
    .join("\n    ");
}

function page(meta, path, renderPath) {
  return template
    .replace(META_BLOCK, headTags(meta, path))
    .replace("<!--app-html-->", render(renderPath));
}

for (const path of prerenderPaths) {
  const file = path === "/" ? "index.html" : `${path.slice(1)}.html`;
  await mkdir(dirname(join(dist, file)), { recursive: true });
  await writeFile(join(dist, file), page(pageMeta(path), path, path));
}

// Any path without a page renders the "not found" route.
await writeFile(join(dist, "404.html"), page(notFoundMeta, null, "/404"));

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPaths
  .map((path) => `  <url><loc>${siteUrl}${path}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n")}
</urlset>
`;
await writeFile(join(dist, "sitemap.xml"), sitemap);
await writeFile(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

await rm(ssrDir, { recursive: true, force: true });
console.log(`Prerendered ${prerenderPaths.length} pages, 404.html, sitemap.xml and robots.txt.`);
