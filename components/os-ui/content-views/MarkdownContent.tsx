'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function YouTubeEmbed({ url, title }: { url?: string; title: string }) {
  if (!url) return null;

  let videoId = '';
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') videoId = parsed.pathname.slice(1);
    if (parsed.hostname === 'youtube.com' || parsed.hostname === 'www.youtube.com') {
      videoId = parsed.searchParams.get('v') ?? parsed.pathname.split('/').pop() ?? '';
    }
  } catch {
    return null;
  }

  if (!/^[\w-]{11}$/.test(videoId)) return null;

  return (
    <div className="competition-video-embed">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

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
