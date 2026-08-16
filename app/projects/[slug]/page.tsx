import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { buildImageUrl } from "@/lib/image";
import { getPortfolioData } from "@/lib/portfolio-data";
import { getProjectSlug } from "@/lib/project";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

const findProject = cache(async (slug: string) => {
  const data = await getPortfolioData();
  return { ...data, project: data.projects.find((item) => getProjectSlug(item) === slug) };
});

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await findProject(slug);
  return {
    title: project ? `${project.title} — James Fontanilla` : "Project — James Fontanilla",
    description: project?.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const { settings, project } = await findProject(slug);

  if (!project) notFound();

  const galleryImages = [project.coverImage, ...(project.photos ?? [])].filter(
    (image): image is NonNullable<typeof project.coverImage> => Boolean(image && buildImageUrl(image)),
  );

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
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/projects" className="nav-link is-active">Projects</Link>
          <Link href="/competitions" className="nav-link">Competitions</Link>
          <Link href="/certifications" className="nav-link">Certifications</Link>
          <Link href="/events" className="nav-link">Tech Events</Link>
          <Link href="/contacts" className="nav-link">Contacts</Link>
        </nav>

        <div className="sidebar-card">
          <p className="eyebrow">Project detail</p>
          <div className="status-row">
            <span className="dot" />
            <span>{project.status}</span>
          </div>
          <p className="muted">A closer look at the decisions, contribution, and outcome behind this work.</p>
        </div>

        <div className="sidebar-actions">
          <Link href="/projects" className="button button-ghost">All Projects</Link>
          <Link href="/contacts" className="button button-solid">Contact Me</Link>
        </div>
      </aside>

      <main className="main-content project-detail-page">
        <div className="detail-breadcrumbs">
          <Link href="/projects" className="text-link">← Projects</Link>
          <span>/</span>
          <span>{project.title}</span>
        </div>

        <section className="glass-panel project-detail-hero">
          <div className="project-detail-copy">
            <div className="card-topline">
              <span className="tag">{project.status}</span>
              {project.stack.slice(0, 4).map((item) => (
                <span className="tag tag-secondary" key={item}>{item}</span>
              ))}
            </div>
            <p className="eyebrow">Project case study</p>
            <h1>{project.title}</h1>
            <p className="lede">{project.summary}</p>
            <div className="detail-actions">
              {project.demoUrl ? <a href={project.demoUrl} className="button button-solid">Open demo ↗</a> : null}
              {project.repoUrl ? <a href={project.repoUrl} className="button button-ghost">View repository ↗</a> : null}
            </div>
          </div>
          <div className="project-detail-meta">
            {project.role ? <div><span className="meta-label">Role</span><strong>{project.role}</strong></div> : null}
            {project.period ? <div><span className="meta-label">Period</span><strong>{project.period}</strong></div> : null}
            <div><span className="meta-label">Impact</span><strong>{project.impact}</strong></div>
          </div>
        </section>

        {galleryImages.length ? (
          <section className="project-gallery-section">
            <div className="section-head">
              <div>
                <p className="eyebrow">Visual notes</p>
                <h2>Project photos</h2>
                <span className="section-note">Screens, prototypes, and moments from the build.</span>
              </div>
              <span className="tag tag-secondary">{galleryImages.length} {galleryImages.length === 1 ? "photo" : "photos"}</span>
            </div>
            <div className={`project-gallery ${galleryImages.length === 1 ? "is-single" : ""}`}>
              {galleryImages.map((image, index) => (
                <figure className="project-gallery-item glass-card" key={`${buildImageUrl(image)}-${index}`}>
                  <img src={buildImageUrl(image)} alt={image.alt} loading={index === 0 ? "eager" : "lazy"} />
                  {image.alt ? <figcaption>{image.alt}</figcaption> : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <section className="project-detail-grid">
          <article className="glass-card detail-story-card">
            <p className="eyebrow">The story</p>
            <h2>From challenge to outcome</h2>
            <div className="detail-prose">
              {project.challenge ? <div><span className="meta-label">Challenge</span><p>{project.challenge}</p></div> : null}
              {project.contribution ? <div><span className="meta-label">Contribution</span><p>{project.contribution}</p></div> : null}
              {project.outcome ? <div><span className="meta-label">Outcome</span><p>{project.outcome}</p></div> : null}
              {project.evidence ? <div><span className="meta-label">Evidence</span><p>{project.evidence}</p></div> : null}
              {!project.challenge && !project.contribution && !project.outcome && !project.evidence ? (
                <p className="muted">More case-study notes will appear here as this project is expanded in the admin studio.</p>
              ) : null}
            </div>
          </article>

          <aside className="glass-card detail-side-card">
            <p className="eyebrow">Built with</p>
            <h2>Tools and technologies</h2>
            <div className="detail-tag-list">
              {project.stack.map((item) => <span className="tag tag-secondary" key={item}>{item}</span>)}
            </div>
            <Link href="/projects" className="text-link">Browse more projects →</Link>
          </aside>
        </section>
      </main>

      <aside className="rail glass-panel">
        <div className="rail-card">
          <p className="eyebrow">Case study</p>
          <h3>See the work in context.</h3>
          <p className="muted">Each project now has room for the decisions and proof that a compact card cannot show.</p>
        </div>
        <div className="rail-card">
          <p className="eyebrow">Publishing</p>
          <h3>Photo-ready by default.</h3>
          <p className="muted">Add one cover image and as many additional photo URLs as you need from the admin studio.</p>
        </div>
      </aside>
    </div>
  );
}
