import type { ExternalArticle } from "../data/externalWriting";
import { formatDate } from "../lib/formatDate";

export default function ExternalArticleCard({ article }: { article: ExternalArticle }) {
  return (
    <li className="py-6 first:pt-0 last:pb-0">
      <h3 className="font-serif text-lg font-semibold leading-snug text-ink">{article.title}</h3>
      <p className="mt-0.5 text-sm text-faint">
        {article.platform}
        {" · "}
        <time dateTime={article.date}>{formatDate(article.date, "month")}</time>
      </p>

      <p className="mt-2">{article.description}</p>

      <p className="mt-2 text-sm">
        <a href={article.url} className="link">
          Read externally<span className="sr-only">: {article.title}</span>{" "}
          <span aria-hidden="true">↗</span>
        </a>
      </p>
    </li>
  );
}

/** External articles as a list separated by thin rules. */
export function ExternalArticleList({ articles }: { articles: ExternalArticle[] }) {
  return (
    <ol className="divide-y divide-rule">
      {articles.map((article) => (
        <ExternalArticleCard key={article.url} article={article} />
      ))}
    </ol>
  );
}
