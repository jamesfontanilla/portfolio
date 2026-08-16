import Link from "next/link";
import { getPortfolioData } from "@/lib/portfolio-data";

export const metadata = {
  title: "Competitions — James Fontanilla",
  description: "Competition records, engineering seasons, and team-based proof from James Fontanilla.",
};

export default async function CompetitionsPage() {
  const { settings, competitions } = await getPortfolioData();

  return (
    <div className="page-shell">
      <aside className="sidebar glass-panel">
        <div className="brand">
          <div className="brand-mark">{settings.name.slice(0, 1).toUpperCase()}</div>
          <div><p className="eyebrow">Portfolio</p><h1>{settings.name}</h1></div>
        </div>
        <nav className="sidebar-nav" aria-label="Primary">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/projects" className="nav-link">Projects</Link>
          <Link href="/competitions" className="nav-link is-active">Competitions</Link>
          <Link href="/certifications" className="nav-link">Certifications</Link>
          <Link href="/events" className="nav-link">Tech Events</Link>
          <Link href="/contacts" className="nav-link">Contacts</Link>
        </nav>
        <div className="sidebar-card">
          <p className="eyebrow">Competition archive</p>
          <div className="status-row"><span className="dot" /><span>{competitions.length} public records</span></div>
          <p className="muted">Engineering, teamwork, and delivery when the work has to perform in public.</p>
        </div>
      </aside>

      <main className="main-content">
        <section className="hero glass-panel">
          <div className="hero-copy">
            <p className="eyebrow">Competitions</p>
            <h2>Proof under pressure.</h2>
            <p className="lede">A separate record for robotics, team seasons, and challenges where the result depends on both the build and the people behind it.</p>
          </div>
          <div className="hero-panel"><div className="profile-card glass-card"><p className="eyebrow">Current highlight</p><h3>{competitions[0]?.title ?? "No competition records yet"}</h3><p className="muted">{competitions[0]?.summary ?? "Publish your first competition record from the admin studio."}</p></div></div>
        </section>

        <section className="section-block">
          <div className="section-head"><div><p className="eyebrow">Field notes</p><h2>Competition records</h2><span className="section-note">The people, decisions, and evidence behind each season.</span></div><Link href="/admin" className="text-link">Manage in Admin</Link></div>
          <div style={{ display: "grid", gap: "16px" }}>
            {competitions.map((competition, index) => (
              <article className="content-card glass-card" key={`${competition.title}-${index}`}>
                <div className="card-topline"><span className="tag">{competition.status}</span>{competition.period ? <span className="tag tag-secondary">{competition.period}</span> : null}{competition.tags.slice(0, 2).map((tag) => <span className="tag tag-secondary" key={tag}>{tag}</span>)}</div>
                <h3>{competition.title}</h3>
                <p>{competition.summary}</p>
                {(competition.role || competition.contribution) ? <div style={{ display: "grid", gap: "12px", marginTop: "4px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>{competition.role ? <p style={{ margin: 0 }}><strong>Role</strong> {competition.role}</p> : null}{competition.contribution ? <p style={{ margin: 0 }}><strong>Contribution</strong> {competition.contribution}</p> : null}</div> : null}
                <div className="card-footer"><span>{competition.impact}</span>{competition.evidence ? <small>{competition.evidence}</small> : null}</div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
