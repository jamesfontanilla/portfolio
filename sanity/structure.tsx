import type { StructureResolver } from "sanity/structure";

function StudioOverview() {
  return (
    <div style={{ padding: 24, maxWidth: 960 }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: "#e7c25a", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12, margin: 0 }}>
          Portfolio Studio
        </p>
        <h1 style={{ margin: "8px 0 12px", fontSize: 36 }}>Publishing dashboard</h1>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
          Add projects, certifications, and event posts here. The public site picks them up from the same content model.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {[
          ["Projects", "Screenshots, demos, and repository links."],
          ["Certifications", "Issuer, date earned, and verification URL."],
          ["Tech Events", "Media uploads, recap text, and event tags."],
          ["Site Settings", "Hero copy, contacts, and profile details."],
        ].map(([title, text]) => (
          <div
            key={title}
            style={{
              padding: 18,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>{title}</h2>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.68)", lineHeight: 1.6 }}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const studioStructure: StructureResolver = (S) =>
  S.list()
    .title("Portfolio Studio")
    .items([
      S.listItem()
        .title("Overview")
        .child(S.component().id("overview").title("Overview").component(StudioOverview)),
      S.divider(),
      S.listItem()
        .title("Projects")
        .child(S.documentTypeList("project").title("Projects")),
      S.listItem()
        .title("Certifications")
        .child(S.documentTypeList("certification").title("Certifications")),
      S.listItem()
        .title("Tech Events")
        .child(S.documentTypeList("event").title("Tech Events")),
      S.listItem()
        .title("Site Settings")
        .child(S.defaultDocument({ schemaType: "siteSettings", documentId: "siteSettings" }).title("Site Settings")),
    ]);
