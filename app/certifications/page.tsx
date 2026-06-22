import Link from "next/link";
import { getHomeData } from "@/lib/cms";
import { formatDate } from "@/lib/format";

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

export default async function CertificationsPage() {
  const { settings, certifications } = await getHomeData();
  const latestCertification = certifications[0];

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
          <Link href="/certifications" className="nav-link is-active">
            Certifications
          </Link>
          <Link href="/events" className="nav-link">
            Tech Events
          </Link>
          <Link href="/contacts" className="nav-link">
            Contacts
          </Link>
        </nav>

        <div className="sidebar-card">
          <p className="eyebrow">Credential Count</p>
          <div className="status-row">
            <span className="dot" />
            <span>{certifications.length} certifications published</span>
          </div>
          <p className="muted">{settings.role} profile with verified learning proof.</p>
        </div>

        <div className="sidebar-actions">
          <Link href="/" className="button button-ghost">
            Back Home
          </Link>
          <Link href="/events" className="button button-solid">
            See Events
          </Link>
        </div>
      </aside>

      <main className="main-content">
        <section className="glass-panel archive-hero">
          <div className="archive-hero-copy">
            <p className="eyebrow">Certifications</p>
            <h1>Verified learning archive</h1>
            <p className="lede">
              A full view of certifications, training milestones, and proof of growth for{" "}
              {settings.name}.
            </p>
            <div className="archive-meta">
              <span className="tag">{certifications.length} credentials</span>
              <span className="tag tag-secondary">{settings.role}</span>
              {latestCertification ? (
                <span className="tag tag-secondary">Latest: {formatDate(latestCertification.earnedOn)}</span>
              ) : null}
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
            eyebrow="All Certifications"
            title="Proof of growth"
            note="Each entry keeps the issuer, date earned, and verification link visible."
            action={
              <Link href="/projects" className="text-link">
                See Projects
              </Link>
            }
          />

          <div className="archive-grid certifications-archive">
            {certifications.map((cert, index) => (
              <article className="glass-card archive-card" key={`${cert.title}-${cert.earnedOn}`}>
                <div className="card-topline">
                  <span className="tag">#{String(index + 1).padStart(2, "0")}</span>
                  <span className="tag tag-secondary">{formatDate(cert.earnedOn)}</span>
                </div>

                <h2>{cert.title}</h2>
                <p className="muted">{cert.issuer}</p>

                <div className="archive-footer">
                  {cert.verificationUrl ? (
                    <a href={cert.verificationUrl} className="text-link">
                      Verify certificate
                    </a>
                  ) : (
                    <span className="text-link">Stored in CMS</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <aside className="rail glass-panel">
        <div className="rail-card">
          <p className="eyebrow">Archive Notes</p>
          <h3>Keep credentials current.</h3>
          <p className="muted">Use this page for issued proof, not placeholders.</p>
        </div>

        <div className="rail-card">
          <p className="eyebrow">Featured Action</p>
          <h3>Keep proof current</h3>
          <p className="muted">Add issuer details, verification links, and earned dates from the CMS.</p>
        </div>

        <div className="rail-card">
          <p className="eyebrow">Navigation</p>
          <ul className="stack-list">
            <li>Homepage summary</li>
            <li>Public credential archive</li>
            <li>Projects and event archives</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
