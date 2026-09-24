import { Link, useParams } from "react-router";
import { getPost } from "../lib/blog";
import { formatDate } from "../lib/formatDate";
import NotFound from "./NotFound";

export default function BlogPostPage() {
  const { slug = "" } = useParams();
  const post = getPost(slug);

  if (!post) return <NotFound />;

  return (
    <article>
      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-faint">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        {post.description && (
          <p className="mt-4 text-lg leading-relaxed text-muted">{post.description}</p>
        )}
      </header>

      {/* HTML generated at build time from the post's Markdown file. */}
      <div
        className="article mt-10 max-w-2xl border-t border-rule pt-8"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <footer className="mt-14 max-w-2xl border-t border-rule pt-6">
        <Link to="/blog" className="link">
          ← Back to Blog
        </Link>
      </footer>
    </article>
  );
}
