import Link from "next/link";
import { getHomeData } from "@/lib/cms";
import { formatDate } from "@/lib/format";
import { buildImageUrl } from "@/sanity/lib/image";

export const revalidate = 0;

function SectionHeader({
  eyebrow,
  title,
  note,
  action,
}: {
  eyebrow: string;
  title: string;
  note?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {note ? <span className="section-note">{note}</span> : null}
      </div>
      {action}
    </div>
  );
}

export default async function EventsPage() {
  const { settings, events } = await getHomeData();
  const featuredEvent = events[0];
  const recentEvents = events.slice(1);

  return (
    <div className="page-shell">
      <aside className="sidebar glass-panel">
        <div className="brand">
          <div className="brand-mark">{settings.name.slice(0, 1).toUpperCase()}</div>
          <div>
            <p className="eyebrow">Portfolio</p>
            <h1>{settings.name}</h1>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/projects" className="nav-link">
            Projects
          </Link>
          <Link href="/certifications" className="nav-link">
            Certifications
          </Link>
          <Link href="/events" className="nav-link is-active">
            Tech Events
          </Link>
          <Link href="/contacts" className="nav-link">
            Contacts
          </Link>
        </nav>

        <div className="sidebar-card">
          <p className="eyebrow">Event Count</p>
          <div className="status-row">
            <span className="dot" />
            <span>{events.length} public event entries</span>
          </div>
          <p className="muted">Media, tags, and recaps are all powered by Sanity.</p>
        </div>

        <div className="sidebar-actions">
          <Link href="/" className="button button-ghost">
            Back Home
          </Link>
          <Link href="/projects" className="button button-solid">
            See Projects
          </Link>
        </div>
      </aside>

      <main className="main-content">
        <section className="glass-panel archive-hero">
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
              {featuredEvent ? (
                <span className="tag tag-secondary">{featuredEvent.type}</span>
              ) : null}
            </div>
          </div>

          <div className="archive-actions">
            <Link href="/" className="button button-ghost">
              Back home
            </Link>
            <Link href="/certifications" className="button button-solid">
              See Certifications
            </Link>
          </div>
        </section>

        <section className="section-block">
          <SectionHeader
            eyebrow="All Events"
            title="Timeline and highlights"
            note="Use media, tags, and summaries to make each event entry feel alive."
            action={
              <Link href="/projects" className="text-link">
                See Projects
              </Link>
            }
          />

          {featuredEvent ? (
            <article className="glass-card event-feature">
              <div className="event-media">
                {featuredEvent.media ? (
                  <img
                    src={buildImageUrl(featuredEvent.media)}
                    alt={featuredEvent.media.alt}
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="event-copy">
                <div className="card-topline">
                  <span className="tag">{featuredEvent.type}</span>
                  {featuredEvent.role ? <span className="tag tag-secondary">{featuredEvent.role}</span> : null}
                  {featuredEvent.date ? (
                    <span className="tag tag-secondary">{formatDate(featuredEvent.date)}</span>
                  ) : null}
                </div>
                <h3>{featuredEvent.title}</h3>
                <p className="muted">
                  {featuredEvent.summary}
                  {featuredEvent.location ? ` Held in ${featuredEvent.location}.` : null}
                </p>
                {featuredEvent.tags.length ? (
                  <div className="archive-meta">
                    {featuredEvent.tags.map((tag) => (
                      <span className="tag tag-secondary" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ) : null}

          <div className="archive-grid events-archive">
            {recentEvents.map((event) => (
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
          </div>
        </section>
      </main>

      <aside className="rail glass-panel">
        <div className="rail-card">
          <p className="eyebrow">Archive Notes</p>
          <h3>Show the story behind the photo.</h3>
          <p className="muted">Use recap text and media so each event feels like a real entry.</p>
        </div>

        <div className="rail-card">
          <p className="eyebrow">Featured Action</p>
          <h3>Upload media</h3>
          <p className="muted">Add event photos, badges, and screenshots from the CMS.</p>
        </div>

        <div className="rail-card">
          <p className="eyebrow">Navigation</p>
          <ul className="stack-list">
            <li>Conference attendance</li>
            <li>Meetups and workshops</li>
            <li>Speaking and learning moments</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
