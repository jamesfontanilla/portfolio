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

function StatChip({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="meta-chip">
      <span className="meta-label">{label}</span>
      <strong>{value}</strong>
      <span>{description}</span>
    </div>
  );
}

export default async function HomePage() {
  const { settings, projects, certifications, events } = await getHomeData();
  const featuredProject = projects[0];
  const contactLinks = [
    { label: "Email", href: `mailto:${settings.email}` },
    { label: "LinkedIn", href: settings.linkedinUrl },
    { label: "GitHub", href: settings.githubUrl },
    settings.phoneNumber ? { label: "Phone", href: `tel:${settings.phoneNumber}` } : null,
    settings.xUrl ? { label: "X", href: settings.xUrl } : null,
    settings.threadsUrl ? { label: "Threads", href: settings.threadsUrl } : null,
    settings.instagramUrl ? { label: "Instagram", href: settings.instagramUrl } : null,
    settings.facebookUrl ? { label: "Facebook", href: settings.facebookUrl } : null,
  ].filter((item): item is { label: string; href: string } => Boolean(item));

  const quickLinks = contactLinks.slice(0, 4);

  const formatQuickLinkValue = (href: string) => href.replace(/^mailto:/, "").replace(/^tel:/, "");

  const stats = [
    { label: "Projects", value: String(projects.length), description: "Featured and recent work" },
    { label: "Certs", value: String(certifications.length), description: "Verified learning proof" },
    { label: "Events", value: String(events.length), description: "Meetups and conference history" },
  ];

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
          <a href="#home" className="nav-link is-active">
            Home
          </a>
          <a href="#projects" className="nav-link">
            Projects
          </a>
          <a href="#certifications" className="nav-link">
            Certifications
          </a>
          <a href="#events" className="nav-link">
            Tech Events
          </a>
          <a href="#contact" className="nav-link">
            Contact
          </a>
        </nav>

        <div className="sidebar-card">
          <p className="eyebrow">Status</p>
          <div className="status-row">
            <span className="dot" />
            <span>{settings.availability}</span>
          </div>
          <p className="muted">{settings.intro}</p>
        </div>

        <div className="sidebar-actions">
          <a href="#projects" className="button button-ghost">
            See Projects
          </a>
          <a href="#contact" className="button button-solid">
            Contact Me
          </a>
        </div>
      </aside>

      <main className="main-content">
        <section id="home" className="hero glass-panel">
          <div className="hero-copy">
            <p className="eyebrow">Developer Portfolio</p>
            <h2>{settings.tagline}</h2>
            <p className="lede">{settings.summary}</p>

            <div className="hero-actions">
              <a href="#projects" className="button button-solid">
                View Projects
              </a>
              <a href="#contact" className="button button-ghost">
                Contact Me
              </a>
            </div>

            <div className="hero-meta">
              <StatChip label="Focus" value={settings.role} description="Product, UI, and systems" />
              <StatChip label="Location" value={settings.location} description="Timezone-aware remote" />
              <StatChip label="Build" value="Next.js + Sanity" description="Single deploy, clean workflow" />
            </div>
          </div>

          <div className="hero-panel">
            <div className="profile-card glass-card">
              <div className="profile-top">
                <div className="avatar">{settings.name.slice(0, 1).toUpperCase()}</div>
                <div>
                  <p className="eyebrow">Profile</p>
                  <h3>{settings.role}</h3>
                  <p className="muted">{settings.bio}</p>
                </div>
              </div>

              <div className="stat-grid">
                {stats.map((stat) => (
                  <div className="stat" key={stat.label}>
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="progress-card">
                <div className="progress-header">
                  <span>Portfolio completeness</span>
                  <strong>85%</strong>
                </div>
                <div className="progress-track">
                  <span className="progress-fill" />
                </div>
                <p className="muted">Ready to expand as you publish new work and proof.</p>
              </div>
            </div>

            <div className="quick-links glass-card">
              <p className="eyebrow">Quick Navigation</p>
              {quickLinks.map((item) => (
                <a key={item.label} href={item.href} className="quick-item">
                  <span>{item.label}</span>
                  <small>{formatQuickLinkValue(item.href)}</small>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="stats-strip">
          <article className="mini-card glass-card">
            <p className="eyebrow">Recent</p>
            <h3>Recent work</h3>
            <p className="muted">Use this slot for your newest launch, redesign, or shipped feature.</p>
          </article>
          <article className="mini-card glass-card">
            <p className="eyebrow">Proof</p>
            <h3>Certification stack</h3>
            <p className="muted">Keep certificates visible with issuer and earned date.</p>
          </article>
          <article className="mini-card glass-card">
            <p className="eyebrow">Visibility</p>
            <h3>Events with media</h3>
            <p className="muted">Document meetups, conferences, and speaking moments.</p>
          </article>
        </section>

        <section id="projects" className="section-block">
          <SectionHeader
            eyebrow="Projects"
            title="Featured work"
            action={
              <Link href="/projects" className="text-link">
                See All
              </Link>
            }
          />

          <div className="card-grid projects-grid">
            {featuredProject ? (
              <article className="content-card glass-card featured-card">
                {featuredProject.coverImage ? (
                  <div className="project-media">
                    <img
                      src={buildImageUrl(featuredProject.coverImage)}
                      alt={featuredProject.coverImage.alt}
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <div className="card-topline">
                  <span className="tag">{featuredProject.status}</span>
                  {featuredProject.stack.slice(0, 2).map((item) => (
                    <span className="tag tag-secondary" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
                <h3>{featuredProject.title}</h3>
                <p>{featuredProject.summary}</p>
                <div className="card-footer">
                  <span>{featuredProject.impact}</span>
                  <div className="card-actions">
                    {featuredProject.demoUrl ? (
                      <a href={featuredProject.demoUrl} className="text-link">
                        Demo
                      </a>
                    ) : null}
                    {featuredProject.repoUrl ? (
                      <a href={featuredProject.repoUrl} className="text-link">
                        Repo
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ) : null}

            {projects.slice(1, 3).map((project) => (
              <article className="content-card glass-card" key={project.title}>
                {project.coverImage ? (
                  <div className="project-media project-media-small">
                    <img
                      src={buildImageUrl(project.coverImage)}
                      alt={project.coverImage.alt}
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <div className="card-topline">
                  <span className="tag">{project.status}</span>
                  <span className="tag tag-secondary">{project.stack[0] ?? "Stack"}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <div className="card-footer">
                  <span>{project.impact}</span>
                  <div className="card-actions">
                    {project.demoUrl ? (
                      <a href={project.demoUrl} className="text-link">
                        Demo
                      </a>
                    ) : null}
                    {project.repoUrl ? (
                      <a href={project.repoUrl} className="text-link">
                        Repo
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="certifications" className="section-block">
          <SectionHeader
            eyebrow="Certifications"
            title="Achievements"
            note="Structured like unlocked badges, not a flat list."
            action={
              <Link href="/certifications" className="text-link">
                See All
              </Link>
            }
          />

          <div className="achievement-grid">
            {certifications.map((cert, index) => (
              <article className="glass-card achievement-card" key={cert.title}>
                <div className="achievement-icon">{String(index + 1).padStart(2, "0")}</div>
                <div>
                  <h3>{cert.title}</h3>
                  <p>
                    {cert.issuer} - {formatDate(cert.earnedOn)}
                  </p>
                </div>
                {cert.verificationUrl ? (
                  <a href={cert.verificationUrl} className="text-link">
                    Verify
                  </a>
                ) : (
                  <span className="text-link">Stored</span>
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="events" className="section-block">
          <SectionHeader
            eyebrow="Tech Events"
            title="Attendance, media, and highlights"
            note="Use this area like a visual timeline."
            action={
              <Link href="/events" className="text-link">
                See All
              </Link>
            }
          />

          <div className="events-layout">
            {events[0] ? (
              <article className="glass-card event-feature">
                <div className="event-media">
                  {events[0].media ? (
                    <img
                      src={buildImageUrl(events[0].media)}
                      alt={events[0].media.alt}
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="event-copy">
                  <div className="card-topline">
                    <span className="tag">{events[0].type}</span>
                    <span className="tag tag-secondary">{events[0].tags[0] ?? "Media"}</span>
                  </div>
                  <h3>{events[0].title}</h3>
                  <p>
                    {events[0].summary} {events[0].location ? `Held in ${events[0].location}.` : null}
                  </p>
                </div>
              </article>
            ) : null}

            <div className="event-list">
              {events.slice(1, 4).map((event) => (
                <article className="glass-card event-item" key={event.title}>
                  <div className="card-topline">
                    <span className="tag">{event.type}</span>
                    {event.tags[0] ? <span className="tag tag-secondary">{event.tags[0]}</span> : null}
                  </div>
                  <h3>{event.title}</h3>
                  <p>
                    {event.summary}
                    {event.date ? ` - ${formatDate(event.date)}` : null}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section-block">
          <SectionHeader
            eyebrow="Contact"
            title="Link in bio, but cleaner"
            note="This is where you make it easy to reach you."
          />

          <div className="contact-layout">
            <article className="glass-card contact-card">
              <h3>Quick links</h3>
              <div className="contact-links">
                {contactLinks.map((item) => (
                  <a key={item.label} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </div>
            </article>

            <article className="glass-card contact-card contact-highlight">
              <p className="eyebrow">Direct contact</p>
              <h3>Reach me fast</h3>
              <p>Use the quick links for email, phone, and social profiles.</p>
            </article>
          </div>
        </section>
      </main>

      <aside className="rail glass-panel">
        <div className="rail-card">
          <p className="eyebrow">Profile Card</p>
          <h3>Clean, premium, and scannable.</h3>
          <p className="muted">Built for desktop first, while still responsive for smaller screens.</p>
        </div>

        <div className="rail-card">
          <p className="eyebrow">Suggested Stack</p>
          <ul className="stack-list">
            <li>Next.js App Router</li>
            <li>Sanity-powered content</li>
            <li>Structured content collections</li>
            <li>Private publishing workflow</li>
          </ul>
        </div>

        <div className="rail-card">
          <p className="eyebrow">Publishing</p>
          <p className="muted">
            Add content in Sanity Studio, then surface it publicly as cards, timelines, and quick
            links.
          </p>
        </div>
      </aside>
    </div>
  );
}
