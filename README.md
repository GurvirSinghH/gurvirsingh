# gurvirsingh

Personal technical website of Gurvir Singh. React + Vite + TypeScript + Tailwind CSS.

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check and build to dist/
npm run preview   # serve the production build
```

## Where things live

| What | File |
| --- | --- |
| Name, email, CV link, education, coursework, interests | `src/data/site.ts` |
| CV source (LaTeX) | `cv/gurvir-singh-cv.tex` |
| CV PDF served by the site | `public/files/gurvir-singh-cv.pdf` |
| Projects (all cards on Home and Projects) | `src/data/projects.ts` |
| Ghost Battery idea page | `src/pages/project-details/GhostBattery.tsx` |
| Blog posts (Markdown) | `src/content/blog/*.md` |
| Images used in blog posts | `public/images/blog/` |
| Research notes (Markdown) | `src/content/notes/*.md` |
| Allowed research note categories | `src/data/noteCategories.ts` |
| Markdown → HTML build step (blog and notes) | `plugins/markdownContent.ts` |
| External writing (articles on other sites) | `src/data/externalWriting.ts` |
| Colours and fonts (each colour is a `light-dark(light, dark)` pair) | `src/index.css` (`@theme` block) |
| Light/dark toggle (follows the system until clicked) | `src/components/ThemeToggle.tsx`, inline script in `index.html` |
| Blog article typography | `src/index.css` (`.article` rules) |
| Page titles and descriptions (tab title, link previews) | `src/lib/pageMeta.ts` |
| Site URL (canonical, Open Graph, sitemap) | `url` in `src/data/site.ts` |
| Link-preview image (1200×630) | `public/og-image.png` |
| Prerendering, sitemap.xml, robots.txt | `scripts/prerender.mjs` |

Reusable components are in `src/components/`: `Navbar`, `Footer`, `ProjectCard`, `PostCard`,
`ExternalArticleCard`, `SectionHeading`, `LinkButton`, `PageHeader`, `Separated`, `ThemeToggle`.

## Updating content

- **Personal details** (email, education, coursework, interests, skills): `src/data/site.ts`.
- **Project screenshots:** each selected project has a `// TODO: add a screenshot or GIF` line in
  `src/data/projects.ts`. Put the image in `public/images/projects/` and replace the line with
  `image: { src: "/images/projects/<file>.png", alt: "What the screenshot shows" }`. It appears
  on the Projects page.
- **LinkedIn:** set `linkedin` in `src/data/site.ts` to show it on the home page, About and the
  footer.
- **Domain:** if the site moves to a custom domain, change `url` in `src/data/site.ts`.

## Adding a project

Append an object to `projects` in `src/data/projects.ts`. Only set `github` / `demo` / `video`
when they really exist; the card shows a link only for fields that are set. Leave
`technologies` empty to hide the Technology row (e.g. for an idea). Set `section` to `"selected"`
(Selected Work), `"other"` (Other Projects) or `"exploration"` (ideas); projects appear in each
section in the order they are listed. The home page shows the `"selected"` projects.

For a details page: create a component in `src/pages/project-details/`, register it in
`src/pages/project-details/index.tsx`, and set `details: "/projects/<slug>"` on the project.

## Writing a blog post

1. Create a Markdown file in `src/content/blog/`, e.g. `src/content/blog/what-is-piml.md`.
2. Start it with frontmatter:

   ```markdown
   ---
   title: "What is Physics-Informed Machine Learning?"
   date: "2026-09-14"
   description: "My notes while learning the fundamentals of PIML."
   tags:
     - PIML
     - Machine Learning
   slug: "what-is-piml"
   ---

   Write the article here. Use ## for section headings.
   ```

   - `title`, `date` (`YYYY-MM-DD`) and `slug` are required. The slug becomes the URL
     (`/blog/what-is-piml`) and may only use lowercase letters, numbers and hyphens.
   - `description` is optional; it is shown on `/blog` and under the post title. `tags` are
     optional and accepted, but not currently displayed.
   - The title is shown from the frontmatter. A `# Title` line at the very top of the body is
     removed only if it repeats that title; any other `#`, `##` or `###` heading is shown as a
     heading.
3. Put any images in `public/images/blog/` and reference them as
   `![Description of the image](/images/blog/figure.png)`.
4. Run `npm run dev` to preview, or `npm run build` to build. The post appears on `/blog`
   automatically, newest first.

If the frontmatter is invalid (missing title, badly formatted date, duplicate slug) the build
stops with a message naming the file.

With no Markdown files in `src/content/blog/`, the Blog page shows "No posts yet."

## Writing a research note

Research notes are for things you are actively trying to understand, investigate or experiment
with. They work like blog posts, with a category instead of tags.

1. Create a Markdown file in `src/content/notes/`. The file name becomes the URL:
   `src/content/notes/what-is-piml.md` → `/notes/what-is-piml`.
2. Start it with frontmatter:

   ```markdown
   ---
   title: "What Is Physics-Informed Machine Learning?"
   date: "2026-09-16"
   category: "PIML"
   description: "My first attempt at understanding the basic idea behind physics-informed machine learning."
   ---

   Write the note here. Use ## for section headings.
   ```

   - `title`, `date` (`YYYY-MM-DD`) and `category` are required. `category` must be one of
     `PIML`, `Machine Learning`, `Scientific Computing`, `Papers` or `Projects` (edit
     `src/data/noteCategories.ts` to change the list).
   - `description` is optional. An optional `slug` overrides the file name in the URL.
   - As with blog posts, a `# ` line at the very top of the body is removed only if it repeats
     the title; other `#`, `##` and `###` headings are shown as headings.
3. Run `npm run dev` or `npm run build`. The note appears on `/notes`, newest first. Its reading
   time ("5 min read") is worked out automatically at build time, as it is for blog posts.

## Adding external writing

Append an entry to `externalWriting` in `src/data/externalWriting.ts` with `title`, `platform`,
`date`, `description` and the article's real `url`.

## Updating the CV

The CV is a one-page A4 LaTeX document in `cv/gurvir-singh-cv.tex`. It needs a LaTeX distribution
with pdfLaTeX and the cm-super fonts (MiKTeX or TeX Live). From the project root:

```bash
mkdir -p cv/build
pdflatex -output-directory=cv/build cv/gurvir-singh-cv.tex
cp cv/build/gurvir-singh-cv.pdf public/files/gurvir-singh-cv.pdf
```

Check that the PDF is still one page (`pdfinfo cv/build/gurvir-singh-cv.pdf`) before copying it.
Links to the CV use `cvUrl` in `src/data/site.ts`. `cv/build/` is not committed.

## Deploying

`npm run build` prerenders every page to static HTML (`dist/index.html`, `dist/projects.html`,
`dist/notes/<slug>.html`, …) with its own title, description, canonical URL and Open Graph tags,
plus `dist/404.html`, `dist/sitemap.xml` and `dist/robots.txt`. React then takes over in the
browser. New notes, posts and details pages are picked up automatically from `src/lib/pageMeta.ts`.

The site is deployed on Vercel. `vercel.json` sets `cleanUrls` so `/projects` serves
`projects.html`, and redirects the old `/contact` page to `/about`. Unknown paths get `404.html`.
