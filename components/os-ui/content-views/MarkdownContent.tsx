'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownContent({ source, compact = false }: { source: string; compact?: boolean }) {
  if (!source.trim()) {
    return <p className="competition-markdown-empty">Add a Markdown story from the admin studio.</p>;
  }

  return (
    <div className={`competition-markdown${compact ? ' competition-markdown-compact' : ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          a: ({ href, children, ...props }) => (
            <a
              {...props}
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          img: ({ src, alt, ...props }) => (
            <img {...props} src={src} alt={alt ?? ''} loading="lazy" />
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
