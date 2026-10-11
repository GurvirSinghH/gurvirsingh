import { Link } from "react-router";
import type { BlogPost } from "../lib/blog";
import { formatDate } from "../lib/formatDate";

/** A blog post as a card; the whole card links to the post. */
export default function PostCard({ post }: { post: BlogPost }) {
  return (
    <li className="card card-lift">
      <p className="card-label bg-ink text-page">Blog post</p>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg leading-snug font-bold text-ink">
          <Link to={`/blog/${post.slug}`} className="stretched-link hover:text-accent">
            {post.title}
          </Link>
        </h3>
        {post.description && (
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{post.description}</p>
        )}
        <p className="card-rule mt-auto pt-2 text-sm text-faint">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {" · "}
          {post.readingMinutes} min read
        </p>
      </div>
    </li>
  );
}

/** Posts as cards, newest first. */
export function PostList({ posts }: { posts: BlogPost[] }) {
  return (
    <ol className="card-grid">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </ol>
  );
}
