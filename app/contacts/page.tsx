import Link from "next/link";
import { getHomeData } from "@/lib/cms";

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

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m3.5 7.5 8.5 6 8.5-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.91.34 1.79.66 2.62a2 2 0 0 1-.45 2.11L8 9.76a16 16 0 0 0 6.24 6.24l1.31-1.31a2 2 0 0 1 2.11-.45c.83.32 1.71.54 2.62.66A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 20c0-2 .2-3.2-1.5-4.2C5 14.9 4 13.5 4 11.5A7.5 7.5 0 0 1 11.5 4h1A7.5 7.5 0 0 1 20 11.5c0 2-.8 3.4-2.5 4.3-1.7 1-1.5 2.2-1.5 4.2" />
      <path d="M9 18v2" />
      <path d="M15 18v2" />
      <path d="M9 14.5c1 .7 2 .9 3 .9s2-.2 3-.9" />
      <circle cx="9" cy="10.5" r=".7" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10.5" r=".7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 10v6" />
      <path d="M8 7.8V8" />
      <path d="M12 16v-3.2c0-1.6 1-2.8 2.4-2.8S16.8 11.2 16.8 13v3" />
      <path d="M8 10.2c.8-.8 2.1-1.1 3.2-.7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

function ThreadsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.8 5.2c-1.3-.9-2.8-1.3-4.3-1.1-3 .4-5 2.8-5 6v1.9c0 4.4 3.2 7.3 7.6 7.3 4.7 0 7.7-3 7.7-7.5 0-2.8-1.2-4.8-3.6-6.2-1.3-.7-2.8-1-4.4-.9-1.5.1-2.8.6-3.8 1.5-1.4 1.3-2.1 3-2.1 5.3 0 1.9 1 3.7 2.6 4.7 1.7 1 3.8 1 5.5.1 1.5-.8 2.4-2.2 2.4-3.8 0-1.9-1.3-3.2-3.4-3.2-1.7 0-2.9.8-3.4 2.1" />
      <path d="M11 12.4c.3-.8 1.1-1.3 2.1-1.3 1.4 0 2.3.9 2.3 2.2 0 1.5-1.1 2.5-2.8 2.5-2 0-3.5-1.1-3.5-3v-.8" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M13.6 8.2h1.6V6.4h-1.8c-1.7 0-2.8 1.2-2.8 3v1.5H9v2h1.6v5h2v-5h1.8l.4-2h-2.2V9.8c0-.9.4-1.6 1-1.6Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

type LinkItem = {
  label: string;
  href: string;
  detail: string;
  note: string;
  tone: string;
  icon: React.ReactNode;
};

export default async function ContactsPage() {
  const { settings } = await getHomeData();

  const linkItems: LinkItem[] = [
    {
      label: "Email",
      href: `mailto:${settings.email}`,
      detail: settings.email,
      note: "Best for briefs, collabs, and introductions.",
      tone: "linear-gradient(135deg, rgba(231, 194, 90, 0.22), rgba(231, 194, 90, 0.08))",
      icon: <EmailIcon />,
    },
    {
      label: "Phone",
      href: `tel:${settings.phoneNumber}`,
      detail: settings.phoneNumber ?? "",
      note: "Fastest for direct follow-up.",
      tone: "linear-gradient(135deg, rgba(87, 188, 126, 0.22), rgba(87, 188, 126, 0.08))",
      icon: <PhoneIcon />,
    },
    {
      label: "LinkedIn",
      href: settings.linkedinUrl,
      detail: "linkedin.com/in/jamesrfontanilla",
      note: "Professional updates and networking.",
      tone: "linear-gradient(135deg, rgba(10, 102, 194, 0.24), rgba(10, 102, 194, 0.08))",
      icon: <LinkedInIcon />,
    },
    {
      label: "GitHub",
      href: settings.githubUrl,
      detail: "github.com/jamesfontanilla",
      note: "Code, experiments, and open-source work.",
      tone: "linear-gradient(135deg, rgba(24, 23, 23, 0.94), rgba(61, 61, 61, 0.24))",
      icon: <GitHubIcon />,
    },
    {
      label: "X",
      href: settings.xUrl ?? "#",
      detail: "x.com/thinkaboutjaime",
      note: "Short updates, thoughts, and occasional posts.",
      tone: "linear-gradient(135deg, rgba(15, 20, 25, 0.94), rgba(48, 48, 48, 0.24))",
      icon: <XIcon />,
    },
    {
      label: "Threads",
      href: settings.threadsUrl ?? "#",
      detail: "threads.com/@jxmsfnt",
      note: "Casual updates and in-progress sharing.",
      tone: "linear-gradient(135deg, rgba(17, 17, 17, 0.94), rgba(60, 60, 60, 0.2))",
      icon: <ThreadsIcon />,
    },
    {
      label: "Instagram",
      href: settings.instagramUrl ?? "#",
      detail: "instagram.com/jxmsnft",
      note: "Photos, recaps, and visual moments.",
      tone: "linear-gradient(135deg, rgba(225, 48, 108, 0.24), rgba(252, 175, 69, 0.14))",
      icon: <InstagramIcon />,
    },
    {
      label: "Facebook",
      href: settings.facebookUrl ?? "#",
      detail: "facebook.com/jamesrfontanilla",
      note: "A public profile and extra reach.",
      tone: "linear-gradient(135deg, rgba(24, 119, 242, 0.24), rgba(24, 119, 242, 0.08))",
      icon: <FacebookIcon />,
    },
  ];

  const primaryLinks = linkItems.slice(0, 4);
  const socialLinks = linkItems.slice(4);

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
          <Link href="/events" className="nav-link">
            Tech Events
          </Link>
          <Link href="/contacts" className="nav-link is-active">
            Contacts
          </Link>
        </nav>

        <div className="sidebar-card">
          <p className="eyebrow">Link in bio</p>
          <div className="status-row">
            <span className="dot" />
            <span>{settings.availability}</span>
          </div>
          <p className="muted">A single, clean place for every profile and direct contact path.</p>
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
            <p className="eyebrow">Contacts</p>
            <h1>Link in bio, but premium</h1>
            <p className="lede">
              A clean contact hub for email, socials, and direct links, built to feel like a modern
              creator bio page instead of a plain address book.
            </p>
            <div className="archive-meta">
              <span className="tag">Email</span>
              <span className="tag tag-secondary">Socials</span>
              <span className="tag tag-secondary">One-page hub</span>
            </div>
          </div>

          <div className="archive-actions">
            <Link href="/" className="button button-ghost">
              Back home
            </Link>
            <Link href="/projects" className="button button-solid">
              See Projects
            </Link>
          </div>
        </section>

        <section className="section-block">
          <SectionHeader
            eyebrow="Primary Links"
            title="Fastest ways to reach me"
            note="Use these first for inquiries, collaborations, and direct contact."
          />

          <div className="contacts-grid">
            {primaryLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="glass-card contact-tile"
              >
                <div className="contact-tile-main">
                  <div className="contact-badge" style={{ background: item.tone, color: "#fff" }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="eyebrow">{item.label}</p>
                    <h3>{item.detail}</h3>
                    <p className="muted">{item.note}</p>
                  </div>
                </div>
                <span className="text-link contact-open">Open</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section-block">
          <SectionHeader
            eyebrow="Socials"
            title="Profiles with logos"
            note="Each card keeps the platform identity visible and easy to scan."
          />

          <div className="contacts-grid">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="glass-card contact-tile"
              >
                <div className="contact-tile-main">
                  <div className="contact-badge" style={{ background: item.tone, color: "#fff" }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="eyebrow">{item.label}</p>
                    <h3>{item.detail}</h3>
                    <p className="muted">{item.note}</p>
                  </div>
                </div>
                <span className="text-link contact-open">Visit</span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <aside className="rail glass-panel">
        <div className="rail-card">
          <p className="eyebrow">UI Pattern</p>
          <h3>One hero, stacked actions, fast scans.</h3>
          <p className="muted">
            This borrows the strong, minimal structure common in link-in-bio pages and keeps the
            public profile easy to skim.
          </p>
        </div>

        <div className="rail-card">
          <p className="eyebrow">Ordering</p>
          <ul className="stack-list">
            <li>Email first</li>
            <li>Professional profiles next</li>
            <li>Social feeds after that</li>
          </ul>
        </div>

        <div className="rail-card">
          <p className="eyebrow">Navigation</p>
          <ul className="stack-list">
            <li>Home summary</li>
            <li>Project archive</li>
            <li>Contact hub</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
