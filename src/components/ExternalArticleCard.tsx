import type { ExternalArticle } from "../data/externalWriting";
import { formatDate } from "../lib/formatDate";

/** An article published elsewhere, as a card; the whole card links to it. */
export default function ExternalArticleCard({ article }: { article: ExternalArticle }) {
  return (
    <li className="card card-lift">
      <p className="card-label bg-tint-blue text-ink">{article.platform}</p>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg leading-snug font-bold text-ink">
          <a href={article.url} className="stretched-link hover:text-accent">
            {article.title}
            <span className="sr-only"> (on {article.platform})</span>
          </a>
        </h3>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{article.description}</p>
        <p className="card-rule mt-auto flex justify-between gap-4 pt-2 text-sm text-faint">
          <time dateTime={article.date}>{formatDate(article.date, "month")}</time>
          <span aria-hidden="true">↗</span>
        </p>
      </div>
    </li>
  );
}

/** External articles as cards. */
export function ExternalArticleList({ articles }: { articles: ExternalArticle[] }) {
  return (
    <ol className="card-grid">
      {articles.map((article) => (
        <ExternalArticleCard key={article.url} article={article} />
      ))}
    </ol>
  );
}
