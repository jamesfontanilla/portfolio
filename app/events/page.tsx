import Link from "next/link";
import { getHomeData } from "@/lib/cms";
import { formatDate } from "@/lib/format";
import { buildImageUrl } from "@/sanity/lib/image";

export const revalidate = 0;

export default async function EventsPage() {
  const { settings, events } = await getHomeData();

  return (
    <main className="archive-page">
      <header className="glass-card archive-hero">
        <div className="archive-hero-copy">
          <p className="eyebrow">Tech Events</p>
          <h1>Attendance and media archive</h1>
          <p className="lede">
            A full timeline of conferences, meetups, workshops, and speaking moments for{" "}
            {settings.name}.
          </p>
          <div className="archive-meta">
            <span className="tag">{events.length} events</span>
            <span className="tag tag-secondary">Media enabled</span>
          </div>
        </div>

        <div className="archive-actions">
          <Link href="/" className="button button-ghost">
            Back home
          </Link>
          <Link href="/studio" className="button button-solid">
            Open Studio
          </Link>
        </div>
      </header>

      <section className="archive-grid events-archive">
        {events.map((event) => (
          <article className="glass-card archive-card" key={`${event.title}-${event.date}`}>
            {event.media ? (
              <div className="archive-media">
                <img src={buildImageUrl(event.media)} alt={event.media.alt} loading="lazy" />
              </div>
            ) : null}

            <div className="card-topline">
              <span className="tag">{event.type}</span>
              {event.role ? <span className="tag tag-secondary">{event.role}</span> : null}
              {event.date ? <span className="tag tag-secondary">{formatDate(event.date)}</span> : null}
            </div>

            <h2>{event.title}</h2>
            <p className="muted">
              {event.summary}
              {event.location ? ` Held in ${event.location}.` : null}
            </p>

            {event.tags.length ? (
              <div className="archive-meta">
                {event.tags.map((tag) => (
                  <span className="tag tag-secondary" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
