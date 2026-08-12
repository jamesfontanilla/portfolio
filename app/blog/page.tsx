import { getPortfolioData } from "@/lib/portfolio-data";
import { formatDate } from "@/lib/format";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Jaime Fontanilla",
  description: "Thoughts on design, development, and building things.",
};

export default async function BlogPage() {
  const data = await getPortfolioData();
  const posts = data.blogPosts ?? [];

  return (
    <main className="archive-page">
      <header className="archive-hero glass-panel">
        <div className="archive-hero-copy">
          <p className="eyebrow">Blog</p>
          <h1>Thoughts &amp; Writing</h1>
        </div>
      </header>

      <div className="archive-grid" style={{ display: "grid", gap: "16px" }}>
        {posts.map((post) => (
          <article key={post.slug} className="archive-card glass-card" style={{ padding: "22px" }}>
            <div className="archive-meta">
              <span className="tag">{formatDate(post.publishedAt)}</span>
              {post.featured && <span className="tag tag-secondary">Featured</span>}
              {post.tags.map((tag) => (
                <span key={tag} className="tag tag-secondary">
                  {tag}
                </span>
              ))}
            </div>
            <h3>{post.title}</h3>
            {post.excerpt && <p className="muted">{post.excerpt}</p>}
          </article>
        ))}
        {posts.length === 0 && (
          <p className="muted" style={{ textAlign: "center", padding: "40px" }}>
            No posts yet. Check back soon!
          </p>
        )}
      </div>
    </main>
  );
}
