import Link from "next/link";
import { getHomeData } from "@/lib/cms";
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

export default async function ProjectsPage() {
  const { settings, projects } = await getHomeData();
  const featuredProject = projects[0];
  const otherProjects = projects.slice(1);

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
          <Link href="/projects" className="nav-link is-active">
            Projects
          </Link>
          <Link href="/certifications" className="nav-link">
            Certifications
          </Link>
          <Link href="/events" className="nav-link">
            Tech Events
          </Link>
          <Link href="/#contact" className="nav-link">
            Contact
          </Link>
        </nav>

        <div className="sidebar-card">
          <p className="eyebrow">Project Count</p>
          <div className="status-row">
            <span className="dot" />
            <span>{projects.length} public projects</span>
          </div>
          <p className="muted">{settings.role} portfolio with demos, repos, and case studies.</p>
        </div>

        <div className="sidebar-actions">
          <Link href="/" className="button button-ghost">
            Back Home
          </Link>
          <Link href="/certifications" className="button button-solid">
            See Certifications
          </Link>
        </div>
      </aside>

      <main className="main-content">
        <section className="glass-panel archive-hero">
          <div className="archive-hero-copy">
            <p className="eyebrow">Projects</p>
            <h1>Featured work archive</h1>
            <p className="lede">
              A full collection of shipped products, experiments, and case studies for {settings.name}.
            </p>
            <div className="archive-meta">
              <span className="tag">{projects.length} projects</span>
              <span className="tag tag-secondary">{settings.role}</span>
              {featuredProject ? <span className="tag tag-secondary">{featuredProject.status}</span> : null}
            </div>
          </div>

          <div className="archive-actions">
            <Link href="/" className="button button-ghost">
              Back home
            </Link>
            <Link href="/events" className="button button-solid">
              See Events
            </Link>
          </div>
        </section>

        <section className="section-block">
          <SectionHeader
            eyebrow="All Projects"
            title="Work, case studies, and experiments"
            note="Featured projects lead, while the rest stay easy to scan and compare."
            action={
              <Link href="/events" className="text-link">
                See Events
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

            {otherProjects.map((project) => (
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
      </main>

      <aside className="rail glass-panel">
        <div className="rail-card">
          <p className="eyebrow">Archive Notes</p>
          <h3>Lead with the strongest work.</h3>
          <p className="muted">Put the clearest project first so visitors get the right impression fast.</p>
        </div>

        <div className="rail-card">
          <p className="eyebrow">Featured Action</p>
          <h3>Show your best demo</h3>
          <p className="muted">Add demo and repo links so each project can stand on its own.</p>
        </div>

        <div className="rail-card">
          <p className="eyebrow">Navigation</p>
          <ul className="stack-list">
            <li>Featured case studies</li>
            <li>Shipped products</li>
            <li>Experiments and builds</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
