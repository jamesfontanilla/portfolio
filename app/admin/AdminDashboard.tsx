"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { fallbackHomeData } from "@/lib/site-data";
import { createClient } from "@/lib/supabase/client";

const MEDIA_BUCKET = "portfolio-media";
const MAX_MEDIA_SIZE = 10 * 1024 * 1024;
const ALLOWED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

type ContentKind = "settings" | "project" | "competition" | "certification" | "event" | "blog";
type EntryStatus = "draft" | "published" | "archived";

type ContentEntry = {
  id: string;
  kind: ContentKind;
  slug: string | null;
  title: string;
  status: EntryStatus;
  featured: boolean;
  data: Record<string, unknown>;
  updated_at: string;
};

type EditorState = {
  id: string | null;
  kind: ContentKind;
  slug: string;
  title: string;
  status: EntryStatus;
  featured: boolean;
  fields: Record<string, string>;
};

const sections: { kind: ContentKind; label: string; singular: string }[] = [
  { kind: "settings", label: "Profile", singular: "profile" },
  { kind: "project", label: "Projects", singular: "project" },
  { kind: "competition", label: "Competitions", singular: "competition" },
  { kind: "certification", label: "Certifications", singular: "certification" },
  { kind: "event", label: "Events", singular: "event" },
  { kind: "blog", label: "Blog", singular: "post" },
];

const text = (value: unknown) => (typeof value === "string" ? value : "");
const arrayText = (value: unknown) => (Array.isArray(value)
  ? value
    .map((item) => {
      if (typeof item === "string") return item;
      if (typeof item === "object" && item !== null && typeof (item as { url?: unknown }).url === "string") {
        return (item as { url: string }).url;
      }
      return "";
    })
    .filter(Boolean)
    .join(", ")
  : "");

function emptyEditor(kind: ContentKind): EditorState {
  if (kind === "settings") {
    return {
      id: null,
      kind,
      slug: "site-settings",
      title: fallbackHomeData.settings.name,
      status: "published",
      featured: true,
      fields: Object.fromEntries(Object.entries(fallbackHomeData.settings).map(([key, value]) => [key, String(value ?? "")])),
    };
  }

  const fields: Record<string, string> = kind === "project"
    ? { summary: "", status: "Live", stack: "", impact: "", role: "", period: "", challenge: "", contribution: "", outcome: "", evidence: "", coverImage: "", photos: "", demoUrl: "", repoUrl: "" }
    : kind === "competition"
      ? { status: "International", tags: "", body: "", photos: "" }
      : kind === "certification"
      ? { issuer: "", earnedOn: "", verificationUrl: "" }
      : kind === "event"
        ? { type: "Conference", role: "Attendee", date: "", location: "", summary: "", tags: "", media: "" }
        : { slug: "", excerpt: "", publishedAt: "", tags: "", body: "", coverImage: "" };

  return { id: null, kind, slug: "", title: "", status: "draft", featured: false, fields };
}

function editorFromEntry(entry: ContentEntry): EditorState {
  const editor = emptyEditor(entry.kind);
  const data = entry.data ?? {};
  const fields = Object.fromEntries(
    Object.keys(editor.fields).map((key) => [key, key === "stack" || key === "tags" || key === "photos" ? arrayText(data[key]) : text(data[key])]),
  );
  return {
    ...editor,
    id: entry.id,
    slug: entry.slug ?? text(data.slug),
    title: entry.title,
    status: entry.status,
    featured: entry.featured,
    fields,
  };
}

function toData(editor: EditorState) {
  const data: Record<string, unknown> = { ...editor.fields };
  if (editor.kind === "project" || editor.kind === "competition" || editor.kind === "event" || editor.kind === "blog") {
    for (const key of ["stack", "tags", "photos"]) {
      if (key in data) data[key] = String(data[key] ?? "").split(",").map((value) => value.trim()).filter(Boolean);
    }
  }
  if (editor.kind === "blog") data.slug = editor.fields.slug || editor.slug;
  return data;
}

function formatUpdated(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default function AdminDashboard({ userEmail }: { userEmail: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [activeKind, setActiveKind] = useState<ContentKind>("settings");
  const [editor, setEditor] = useState<EditorState>(() => emptyEditor("settings"));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EntryStatus>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function loadEntries(selectKind = activeKind) {
    setLoading(true);
    setError("");
    const { data, error: loadError } = await supabase.from("content_entries").select("*").order("updated_at", { ascending: false });
    if (loadError) {
      setError(loadError.message);
      setLoading(false);
      return;
    }
    const nextEntries = (data ?? []) as ContentEntry[];
    setEntries(nextEntries);
    const nextEntry = nextEntries.find((entry) => entry.kind === selectKind);
    setEditor(nextEntry ? editorFromEntry(nextEntry) : emptyEditor(selectKind));
    setLoading(false);
  }

  useEffect(() => {
    void loadEntries("settings");
  }, []);

  const kindEntries = entries.filter((entry) => entry.kind === activeKind);
  const visibleEntries = kindEntries.filter((entry) => {
    const matchesSearch = `${entry.title} ${entry.slug ?? ""}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (statusFilter === "all" || entry.status === statusFilter);
  });

  function chooseKind(kind: ContentKind) {
    setActiveKind(kind);
    setSearch("");
    const first = entries.find((entry) => entry.kind === kind);
    setEditor(first ? editorFromEntry(first) : emptyEditor(kind));
    setNotice("");
  }

  function chooseEntry(entry: ContentEntry) {
    setEditor(editorFromEntry(entry));
    setNotice("");
    setError("");
  }

  function updateField(key: string, value: string) {
    setEditor((current) => ({ ...current, fields: { ...current.fields, [key]: value } }));
  }

  function createNew() {
    setEditor(emptyEditor(activeKind));
    setNotice("");
    setError("");
  }

  async function save(status: EntryStatus = editor.status) {
    if (!editor.title.trim()) {
      setError("Add a title before saving.");
      return;
    }
    const generatedSlug = editor.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setSaving(true);
    setNotice("");
    setError("");
    const payload = {
      kind: editor.kind,
      slug: editor.kind === "settings" ? "site-settings" : editor.slug.trim() || generatedSlug || null,
      title: editor.title.trim(),
      status,
      featured: editor.featured,
      data: toData(editor),
    };
    const query = editor.id
      ? supabase.from("content_entries").update(payload).eq("id", editor.id).select().single()
      : supabase.from("content_entries").insert(payload).select().single();
    const { data, error: saveError } = await query;
    if (saveError) {
      setError(saveError.message);
      setSaving(false);
      return;
    }
    const saved = data as ContentEntry;
    setEntries((current) => [saved, ...current.filter((entry) => entry.id !== saved.id)]);
    setEditor(editorFromEntry(saved));
    setNotice(status === "published" ? "Published to the portfolio." : `Saved as ${status}.`);
    setSaving(false);
  }

  async function removeEntry() {
    if (!editor.id || !window.confirm(`Delete “${editor.title}”? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from("content_entries").delete().eq("id", editor.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setEntries((current) => current.filter((entry) => entry.id !== editor.id));
    setEditor(emptyEditor(activeKind));
    setNotice("Entry deleted.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  const publishedCount = entries.filter((entry) => entry.status === "published").length;
  const draftCount = entries.filter((entry) => entry.status === "draft").length;
  const projectCount = entries.filter((entry) => entry.kind === "project").length;
  const currentSection = sections.find((section) => section.kind === activeKind) ?? sections[0];

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">JF</div>
          <div><strong>Portfolio</strong><span>Admin studio</span></div>
        </div>
        <nav className="admin-nav" aria-label="Admin sections">
          <button className={`admin-nav-button ${activeKind === "settings" ? "active" : ""}`} onClick={() => chooseKind("settings")}><span>⌂</span>Overview &amp; profile</button>
          {sections.slice(1).map((section) => (
            <button key={section.kind} className={`admin-nav-button ${activeKind === section.kind ? "active" : ""}`} onClick={() => chooseKind(section.kind)}>
              <span>{section.kind === "project" ? "◈" : section.kind === "competition" ? "🏆" : section.kind === "certification" ? "✦" : section.kind === "event" ? "◌" : "✎"}</span>{section.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user"><span className="admin-user-dot" /><div><strong>Signed in</strong><small>{userEmail}</small></div></div>
          <button className="admin-nav-button" onClick={signOut}><span>↪</span>Sign out</button>
          <a className="admin-site-link" href="/">View live portfolio ↗</a>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div><span className="admin-kicker">Workspace / {currentSection.label}</span><h1>{activeKind === "settings" ? "Your portfolio, at a glance." : `Manage ${currentSection.label.toLowerCase()}.`}</h1></div>
          <div className="admin-actions"><a className="admin-button admin-button-secondary" href="/" target="_blank" rel="noreferrer">View site ↗</a><button className="admin-button admin-button-primary" onClick={createNew}>+ New {currentSection.singular}</button></div>
        </header>

        {notice ? <div className="admin-toast admin-success" role="status">{notice}</div> : null}
        {error ? <div className="admin-toast admin-error" role="alert">{error}</div> : null}

        {activeKind === "settings" ? (
          <section className="admin-metrics">
            <article className="admin-metric"><span>Published</span><strong>{publishedCount}</strong><small>Visible on your site</small></article>
            <article className="admin-metric"><span>Drafts</span><strong>{draftCount}</strong><small>Private until you publish</small></article>
              <article className="admin-metric"><span>Projects</span><strong>{projectCount}</strong><small>Proof of your work</small></article>
              <article className="admin-metric"><span>Competitions</span><strong>{entries.filter((entry) => entry.kind === "competition").length}</strong><small>Performance under pressure</small></article>
            <article className="admin-metric admin-metric-accent"><span>Publishing flow</span><strong>Ready</strong><small>Supabase + Vercel connected</small></article>
          </section>
        ) : null}

        <div className="admin-workspace">
          <section className="admin-list-panel">
            <div className="admin-panel-heading"><div><span className="admin-kicker">Content collection</span><h2>{currentSection.label}</h2></div><span className="admin-pill">{kindEntries.length} entries</span></div>
            <div className="admin-toolbar"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search entries…" aria-label="Search entries" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | EntryStatus)} aria-label="Filter by status"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option><option value="archived">Archived</option></select></div>
            <div className="admin-entry-list">
              {loading ? <p className="admin-empty">Loading your content…</p> : visibleEntries.length === 0 ? <p className="admin-empty">No matching entries. Create your first {currentSection.singular}.</p> : visibleEntries.map((entry) => (
                <button key={entry.id} className={`admin-entry-row ${editor.id === entry.id ? "selected" : ""}`} onClick={() => chooseEntry(entry)}>
                  <span className="admin-entry-icon">{entry.kind === "settings" ? "⌂" : entry.kind === "project" ? "◈" : entry.kind === "competition" ? "🏆" : entry.kind === "certification" ? "✦" : entry.kind === "event" ? "◌" : "✎"}</span>
                  <span className="admin-entry-copy"><strong>{entry.title}</strong><small>{entry.slug || "Site-wide profile"}</small></span>
                  <span className={`admin-status admin-status-${entry.status}`}>{entry.status}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="admin-editor-panel">
            <div className="admin-editor-heading"><div><span className="admin-kicker">{editor.id ? "Editing entry" : "New entry"}</span><h2>{editor.title || `New ${currentSection.singular}`}</h2></div><select value={editor.status} onChange={(event) => setEditor((current) => ({ ...current, status: event.target.value as EntryStatus }))} aria-label="Entry status"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div>
            <div className="admin-editor-form">
              <label className="admin-field admin-field-wide"><span>Title</span><input value={editor.title} onChange={(event) => setEditor((current) => ({ ...current, title: event.target.value }))} placeholder="Give this entry a clear title" /></label>
              {editor.kind !== "settings" ? <label className="admin-field"><span>Slug</span><input value={editor.slug} onChange={(event) => setEditor((current) => ({ ...current, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") }))} placeholder="url-friendly-slug" /></label> : null}
              {editor.kind === "settings" ? <SettingsFields editor={editor} updateField={updateField} /> : <ContentFields editor={editor} updateField={updateField} supabase={supabase} />}
              {editor.kind !== "certification" && editor.kind !== "settings" ? <label className="admin-check"><input type="checkbox" checked={editor.featured} onChange={(event) => setEditor((current) => ({ ...current, featured: event.target.checked }))} /><span>Feature this entry on the public homepage</span></label> : null}
            </div>
            <div className="admin-editor-footer"><div>{editor.id ? <button className="admin-delete-button" onClick={removeEntry}>Delete</button> : <span className="admin-editor-hint">Changes stay private until published.</span>}</div><div className="admin-actions"><button className="admin-button admin-button-secondary" disabled={saving} onClick={() => save("draft")}>Save draft</button><button className="admin-button admin-button-primary" disabled={saving} onClick={() => save("published")}>{saving ? "Saving…" : "Publish changes"}</button></div></div>
          </section>
        </div>
      </section>
    </main>
  );
}

function SettingsFields({ editor, updateField }: { editor: EditorState; updateField: (key: string, value: string) => void }) {
  const groups = [
    { label: "Identity", keys: ["name", "role", "tagline", "summary", "intro", "bio"] },
    { label: "Availability", keys: ["location", "availability", "email", "phoneNumber"] },
    { label: "Links", keys: ["githubUrl", "linkedinUrl", "xUrl", "threadsUrl", "resumeUrl", "facebookUrl", "instagramUrl"] },
  ];
  return <>{groups.map((group) => <div className="admin-field-group" key={group.label}><span className="admin-group-label">{group.label}</span><div className="admin-field-grid">{group.keys.map((key) => <label className={`admin-field ${["summary", "bio", "tagline"].includes(key) ? "admin-field-wide" : ""}`} key={key}><span>{key.replace(/([A-Z])/g, " $1")}</span>{["summary", "bio", "tagline"].includes(key) ? <textarea className="admin-textarea" value={editor.fields[key] ?? ""} onChange={(event) => updateField(key, event.target.value)} /> : <input value={editor.fields[key] ?? ""} onChange={(event) => updateField(key, event.target.value)} />}</label>)}</div></div>)}</>;
}

function ContentFields({ editor, updateField, supabase }: { editor: EditorState; updateField: (key: string, value: string) => void; supabase: ReturnType<typeof createClient> }) {
  const fields = Object.keys(editor.fields);
  return (
    <div className="admin-field-grid">
      {fields.map((key) => {
        const long = ["summary", "excerpt", "body"].includes(key);
        const list = key === "tags" || key === "stack" || key === "photos";
        const media = key === "coverImage" || key === "photos" || key === "media";

        if (media) {
          return <MediaField key={key} editor={editor} fieldKey={key} value={editor.fields[key] ?? ""} updateField={updateField} supabase={supabase} />;
        }

        return (
          <label className={`admin-field ${long ? "admin-field-wide" : ""}`} key={key}>
            <span>{key === "body" && editor.kind === "competition" ? "Body (Markdown)" : key.replace(/([A-Z])/g, " $1")}</span>
            {long ? (
              <>
                <textarea className="admin-textarea" rows={key === "body" ? 16 : 4} value={editor.fields[key] ?? ""} onChange={(event) => updateField(key, event.target.value)} placeholder={key === "body" && editor.kind === "competition" ? "# Competition title\n\nTell the full story here using Markdown…" : ""} />
                {key === "body" && editor.kind === "competition" ? <small className="admin-markdown-help">Supports headings, links, lists, quotes, code, tables, and emphasis. Keep the story in this one field.</small> : null}
              </>
            ) : (
              <input value={editor.fields[key] ?? ""} onChange={(event) => updateField(key, event.target.value)} placeholder={list ? "Separate items with commas" : ""} />
            )}
          </label>
        );
      })}
    </div>
  );
}

function MediaField({
  editor,
  fieldKey,
  value,
  updateField,
  supabase,
}: {
  editor: EditorState;
  fieldKey: string;
  value: string;
  updateField: (key: string, value: string) => void;
  supabase: ReturnType<typeof createClient>;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const multiple = fieldKey === "photos";
  const urls = value.split(",").map((item) => item.trim()).filter(Boolean);

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;

    setUploading(true);
    setUploadError("");
    const uploadedPaths: string[] = [];
    const uploadedUrls: string[] = [];
    const folder = (editor.slug || editor.title || "draft").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "draft";

    try {
      for (const file of multiple ? files : files.slice(0, 1)) {
        if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
          throw new Error(`${file.name} is not a supported image. Use JPG, PNG, WebP, GIF, or AVIF.`);
        }
        if (file.size > MAX_MEDIA_SIZE) {
          throw new Error(`${file.name} is larger than 10 MB.`);
        }

        const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const uniqueId = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const path = `${editor.kind}/${folder}/${uniqueId}.${extension}`;
        const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
        uploadedUrls.push(supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl);
      }

      updateField(fieldKey, multiple ? [...urls, ...uploadedUrls].join(", ") : uploadedUrls[0] ?? "");
    } catch (error) {
      if (uploadedPaths.length) await supabase.storage.from(MEDIA_BUCKET).remove(uploadedPaths);
      setUploadError(error instanceof Error ? error.message : "The image could not be uploaded.");
    } finally {
      setUploading(false);
    }
  }

  async function removeUrl(url: string) {
    updateField(fieldKey, urls.filter((item) => item !== url).join(", "));
    if (!url.startsWith("http")) return;
    try {
      const parsed = new URL(url);
      const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
      const markerIndex = parsed.pathname.indexOf(marker);
      if (markerIndex >= 0) {
        const path = decodeURIComponent(parsed.pathname.slice(markerIndex + marker.length));
        const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
        if (error) throw error;
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "The image was removed from the draft but could not be deleted from storage.");
    }
  }

  return (
    <div className="admin-media-field admin-field-wide">
      <span>{fieldKey === "photos" ? `${editor.kind === "competition" ? "Competition" : "Project"} gallery` : fieldKey.replace(/([A-Z])/g, " $1")}</span>
      <div className="admin-upload-row">
        <label className="admin-upload-button">
          <input className="admin-upload-input" type="file" accept={ALLOWED_MEDIA_TYPES.join(",")} multiple={multiple} onChange={uploadFiles} disabled={uploading} />
          {uploading ? "Uploading…" : multiple ? "Upload photos" : "Upload image"}
        </label>
        <small className="admin-media-help">JPG, PNG, WebP, GIF, or AVIF · up to 10 MB each</small>
      </div>
      <input value={value} onChange={(event) => updateField(fieldKey, event.target.value)} placeholder={multiple ? "Or paste image URLs, separated by commas" : "Or paste an image URL"} />
      {urls.length ? (
        <div className="admin-media-previews">
          {urls.map((url) => (
            <div className="admin-media-preview" key={url}>
              <img src={url} alt="" loading="lazy" />
              <button type="button" className="admin-media-remove" onClick={() => void removeUrl(url)} aria-label={`Remove ${fieldKey === "photos" ? "photo" : "image"}`}>×</button>
            </div>
          ))}
        </div>
      ) : null}
      {uploadError ? <small className="admin-media-error" role="alert">{uploadError}</small> : null}
    </div>
  );
}
