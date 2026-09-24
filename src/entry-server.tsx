/**
 * Server entry used only at build time by scripts/prerender.mjs, which renders
 * every page to static HTML. The browser entry is main.tsx.
 */

import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import { site } from "./data/site";

export { notFoundMeta, pageMeta, prerenderPaths, sitemapPaths } from "./lib/pageMeta";
export const siteUrl = site.url;
export const siteName = site.name;

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}
