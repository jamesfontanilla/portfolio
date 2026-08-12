'use client';

/**
 * BlogView — displays blog posts in a clean, readable list.
 * Requirements: 5.1, 5.7, 5.8, 5.9
 */

import React from 'react';
import { portfolioData } from '@/lib/portfolio-data';
import type { BlogPost } from '@/lib/types';

// ─── Blog post card ───────────────────────────────────────────────────────────

function BlogCard({ post }: { post: BlogPost }) {
  const dateStr = new Date(post.publishedAt).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article
      style={{
        padding: '18px 20px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'border-color 180ms ease, transform 180ms ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(231,194,90,0.2)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{dateStr}</span>
        {post.featured && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'rgba(231,194,90,0.1)',
              border: '1px solid rgba(231,194,90,0.2)',
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          margin: 0,
          fontFamily: '"Space Grotesk", "Manrope", sans-serif',
          fontSize: '1.1rem',
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
        }}
      >
        {post.title}
      </h3>

      {/* Excerpt */}
      {post.excerpt && (
        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          {post.excerpt}
        </p>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
          {post.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: '0.68rem',
                fontWeight: 500,
                color: 'var(--muted)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BlogView() {
  const posts: BlogPost[] = portfolioData.blogPosts ?? [];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div>
        <h2
          style={{
            margin: '0 0 6px',
            fontFamily: '"Space Grotesk", "Manrope", sans-serif',
            fontWeight: 500,
            fontSize: '1.3rem',
            letterSpacing: '-0.03em',
            color: 'var(--text)',
          }}
        >
          Blog
        </h2>
        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)' }}>
          Thoughts on design, development, and building things.
        </p>
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--muted)' }}>
            No posts yet. Check back soon!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
