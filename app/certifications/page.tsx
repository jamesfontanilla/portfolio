import Link from "next/link";
import { getHomeData } from "@/lib/cms";
import { formatDate } from "@/lib/format";

export const revalidate = 0;

export default async function CertificationsPage() {
  const { settings, certifications } = await getHomeData();

  return (
    <main className="archive-page">
      <header className="glass-card archive-hero">
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

      <section className="archive-grid certifications-archive">
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
      </section>
    </main>
  );
}
