import type { BlogPost, Certification, Competition, HomeData, PortfolioEvent, PortfolioImage, Project, SiteSettings } from "@/lib/types";
import { fallbackHomeData } from "@/lib/site-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const portfolioData: HomeData = fallbackHomeData;

type ContentEntry = {
  kind: "settings" | "project" | "competition" | "certification" | "event" | "blog";
  slug: string | null;
  title: string;
  status: string;
  featured: boolean;
  data: Record<string, unknown>;
};

const asText = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);
const asArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

function asImage(value: unknown, fallbackAlt: string) {
  if (typeof value === "string" && value) return { url: value, alt: fallbackAlt };
  if (typeof value === "object" && value !== null) {
    const image = value as { url?: unknown; alt?: unknown; asset?: unknown };
    if (typeof image.url === "string" && image.url) {
      return {
        url: image.url,
        alt: typeof image.alt === "string" && image.alt ? image.alt : fallbackAlt,
        asset: image.asset,
      };
    }
  }
  return undefined;
}

function asImages(value: unknown, fallbackAlt: string): PortfolioImage[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const image = asImage(item, fallbackAlt);
    return image ? [image] : [];
  });
}

function mapContentEntries(entries: ContentEntry[]): HomeData {
  const settingsEntry = entries.find((entry) => entry.kind === "settings");
  const settingsData = settingsEntry?.data ?? {};
  const settings: SiteSettings = {
    ...fallbackHomeData.settings,
    ...settingsData,
    name: asText(settingsData.name, fallbackHomeData.settings.name),
    role: asText(settingsData.role, fallbackHomeData.settings.role),
    tagline: asText(settingsData.tagline, fallbackHomeData.settings.tagline),
    summary: asText(settingsData.summary, fallbackHomeData.settings.summary),
    intro: asText(settingsData.intro, fallbackHomeData.settings.intro),
    bio: asText(settingsData.bio, fallbackHomeData.settings.bio),
    location: asText(settingsData.location, fallbackHomeData.settings.location),
    availability: asText(settingsData.availability, fallbackHomeData.settings.availability),
    email: asText(settingsData.email, fallbackHomeData.settings.email),
    githubUrl: asText(settingsData.githubUrl, fallbackHomeData.settings.githubUrl),
    linkedinUrl: asText(settingsData.linkedinUrl, fallbackHomeData.settings.linkedinUrl),
    resumeUrl: asText(settingsData.resumeUrl, fallbackHomeData.settings.resumeUrl),
  };

  const projects: Project[] = entries
    .filter((entry) => entry.kind === "project")
    .map((entry) => ({
      slug: entry.slug ?? undefined,
      title: entry.title,
      summary: asText(entry.data.summary),
      status: asText(entry.data.status, entry.status),
      stack: asArray(entry.data.stack),
      impact: asText(entry.data.impact),
      role: asText(entry.data.role) || undefined,
      period: asText(entry.data.period) || undefined,
      challenge: asText(entry.data.challenge) || undefined,
      contribution: asText(entry.data.contribution) || undefined,
      outcome: asText(entry.data.outcome) || undefined,
      evidence: asText(entry.data.evidence) || undefined,
      coverImage: asImage(entry.data.coverImage, entry.title),
      photos: asImages(entry.data.photos, entry.title),
      demoUrl: asText(entry.data.demoUrl) || undefined,
      repoUrl: asText(entry.data.repoUrl) || undefined,
      featured: Boolean(entry.data.featured ?? entry.featured),
    }));

  const certifications: Certification[] = entries
    .filter((entry) => entry.kind === "certification")
    .map((entry) => ({
      title: entry.title,
      issuer: asText(entry.data.issuer),
      earnedOn: asText(entry.data.earnedOn),
      verificationUrl: asText(entry.data.verificationUrl) || undefined,
    }));

  const competitions: Competition[] = entries
    .filter((entry) => entry.kind === "competition")
    .map((entry) => ({
      title: entry.title,
      summary: asText(entry.data.summary),
      status: asText(entry.data.status, entry.status),
      tags: asArray(entry.data.tags ?? entry.data.stack),
      impact: asText(entry.data.impact),
      role: asText(entry.data.role) || undefined,
      period: asText(entry.data.period) || undefined,
      challenge: asText(entry.data.challenge) || undefined,
      contribution: asText(entry.data.contribution) || undefined,
      outcome: asText(entry.data.outcome) || undefined,
      evidence: asText(entry.data.evidence) || undefined,
      featured: Boolean(entry.data.featured ?? entry.featured),
    }));

  const events: PortfolioEvent[] = entries
    .filter((entry) => entry.kind === "event")
    .map((entry) => ({
      title: entry.title,
      type: asText(entry.data.type),
      role: asText(entry.data.role),
      date: asText(entry.data.date),
      location: asText(entry.data.location) || undefined,
      summary: asText(entry.data.summary),
      tags: asArray(entry.data.tags),
      media: asImage(entry.data.media, entry.title),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const blogPosts: BlogPost[] = entries
    .filter((entry) => entry.kind === "blog")
    .map((entry) => ({
      title: entry.title,
      slug: asText(entry.data.slug, entry.slug ?? entry.title.toLowerCase().replace(/\s+/g, "-")),
      excerpt: asText(entry.data.excerpt),
      body: Array.isArray(entry.data.body) ? entry.data.body : undefined,
      coverImage: asImage(entry.data.coverImage, entry.title),
      tags: asArray(entry.data.tags),
      publishedAt: asText(entry.data.publishedAt),
      featured: Boolean(entry.data.featured ?? entry.featured),
    }));

  return {
    settings,
    projects: projects.length ? projects : fallbackHomeData.projects,
    competitions: competitions.length ? competitions : fallbackHomeData.competitions,
    certifications: certifications.length ? certifications : fallbackHomeData.certifications,
    events: events.length ? events : fallbackHomeData.events,
    blogPosts: blogPosts.length ? blogPosts : fallbackHomeData.blogPosts,
  };
}

export async function getPortfolioData(): Promise<HomeData> {
  if (!isSupabaseConfigured()) return portfolioData;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("content_entries")
      .select("kind, slug, title, status, featured, data")
      .eq("status", "published")
      .order("created_at", { ascending: true });

    if (error || !data?.length) return portfolioData;
    return mapContentEntries(data as ContentEntry[]);
  } catch {
    return portfolioData;
  }
}
