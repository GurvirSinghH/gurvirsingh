import { ExternalArticleList } from "../components/ExternalArticleCard";
import PageHeader from "../components/PageHeader";
import { PostList } from "../components/PostCard";
import SectionHeading from "../components/SectionHeading";
import { externalWriting } from "../data/externalWriting";
import { posts } from "../lib/blog";

export default function Blog() {
  // External articles, newest first.
  const external = [...externalWriting].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader title="Blog">
        <p>Longer pieces on things I am learning, building, and trying to understand.</p>
      </PageHeader>

      <section aria-label="Posts">
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <p className="border-t border-rule pt-6 text-muted">No posts yet.</p>
        )}
      </section>

      {/* Only shown once there is at least one external article. */}
      {external.length > 0 && (
        <section aria-labelledby="external-writing" className="mt-12">
          <SectionHeading id="external-writing">External writing</SectionHeading>
          <ExternalArticleList articles={external} />
        </section>
      )}
    </>
  );
}
