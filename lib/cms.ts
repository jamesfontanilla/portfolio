import { createClient } from "@sanity/client";
import type { HomeData } from "@/lib/types";
import { fallbackHomeData } from "@/lib/site-data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-22";

const enabled = Boolean(projectId);

export const sanityClient = enabled
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
    })
  : null;

const settingsQuery = `*[_type == "siteSettings"][0]{
  name,
  role,
  tagline,
  summary,
  intro,
  bio,
  location,
  availability,
  email,
  phoneNumber,
  githubUrl,
  linkedinUrl,
  xUrl,
  threadsUrl,
  resumeUrl,
  facebookUrl,
  instagramUrl
}`;

const projectsQuery = `*[_type == "project"] | order(featured desc, _createdAt desc){
  title,
  summary,
  status,
  stack,
  impact,
  coverImage{
    alt,
    asset
  },
  demoUrl,
  repoUrl,
  featured
}`;

const certificationsQuery = `*[_type == "certification"] | order(earnedOn desc, _createdAt desc){
  title,
  issuer,
  earnedOn,
  verificationUrl
}`;

const eventsQuery = `*[_type == "event"] | order(date desc, _createdAt desc){
  title,
  type,
  role,
  date,
  location,
  summary,
  tags,
  media{
    alt,
    asset
  }
}`;

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function normalizeSettings(value: unknown) {
  if (!value || typeof value !== "object") return fallbackHomeData.settings;

  const record = value as Record<string, unknown>;
  return {
    ...fallbackHomeData.settings,
    name: toOptionalString(record.name) ?? fallbackHomeData.settings.name,
    role: toOptionalString(record.role) ?? fallbackHomeData.settings.role,
    tagline: toOptionalString(record.tagline) ?? fallbackHomeData.settings.tagline,
    summary: toOptionalString(record.summary) ?? fallbackHomeData.settings.summary,
    intro: toOptionalString(record.intro) ?? fallbackHomeData.settings.intro,
    bio: toOptionalString(record.bio) ?? fallbackHomeData.settings.bio,
    location: toOptionalString(record.location) ?? fallbackHomeData.settings.location,
    availability: toOptionalString(record.availability) ?? fallbackHomeData.settings.availability,
    email: toOptionalString(record.email) ?? fallbackHomeData.settings.email,
    phoneNumber: toOptionalString(record.phoneNumber) ?? fallbackHomeData.settings.phoneNumber,
    githubUrl: toOptionalString(record.githubUrl) ?? fallbackHomeData.settings.githubUrl,
    linkedinUrl: toOptionalString(record.linkedinUrl) ?? fallbackHomeData.settings.linkedinUrl,
    xUrl: toOptionalString(record.xUrl) ?? fallbackHomeData.settings.xUrl,
    threadsUrl: toOptionalString(record.threadsUrl) ?? fallbackHomeData.settings.threadsUrl,
    resumeUrl: toOptionalString(record.resumeUrl) ?? fallbackHomeData.settings.resumeUrl,
    facebookUrl: toOptionalString(record.facebookUrl) ?? fallbackHomeData.settings.facebookUrl,
    instagramUrl: toOptionalString(record.instagramUrl) ?? fallbackHomeData.settings.instagramUrl,
  };
}

function normalizeProjects(values: unknown): HomeData["projects"] {
  if (!Array.isArray(values) || !values.length) return fallbackHomeData.projects;

  return values.map((value) => {
    const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

    return {
      title: toOptionalString(record.title) ?? "Untitled project",
      summary: toOptionalString(record.summary) ?? "Project summary coming soon.",
      status: toOptionalString(record.status) ?? "Draft",
      stack: toStringArray(record.stack),
      impact: toOptionalString(record.impact) ?? "",
      coverImage:
        record.coverImage && typeof record.coverImage === "object"
          ? {
              alt:
                toOptionalString((record.coverImage as Record<string, unknown>).alt) ??
                toOptionalString(record.title) ??
                "Project cover",
              asset: (record.coverImage as Record<string, unknown>).asset,
            }
          : undefined,
      demoUrl: toOptionalString(record.demoUrl),
      repoUrl: toOptionalString(record.repoUrl),
      featured: Boolean(record.featured),
    };
  });
}

function normalizeCertifications(values: unknown): HomeData["certifications"] {
  if (!Array.isArray(values) || !values.length) return fallbackHomeData.certifications;

  return values.map((value) => {
    const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
    return {
      title: toOptionalString(record.title) ?? "Untitled certification",
      issuer: toOptionalString(record.issuer) ?? "Issuer",
      earnedOn: toOptionalString(record.earnedOn) ?? new Date().toISOString(),
      verificationUrl: toOptionalString(record.verificationUrl),
    };
  });
}

function normalizeEvents(values: unknown): HomeData["events"] {
  if (!Array.isArray(values) || !values.length) return fallbackHomeData.events;

  return values.map((value) => {
    const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
    const media =
      record.media && typeof record.media === "object"
        ? {
            alt:
              toOptionalString((record.media as Record<string, unknown>).alt) ??
              toOptionalString(record.title) ??
              "Event media",
            asset: (record.media as Record<string, unknown>).asset,
          }
        : undefined;

    return {
      title: toOptionalString(record.title) ?? "Untitled event",
      type: toOptionalString(record.type) ?? "Event",
      role: toOptionalString(record.role) ?? "",
      date: toOptionalString(record.date) ?? new Date().toISOString(),
      location: toOptionalString(record.location),
      summary: toOptionalString(record.summary) ?? "Event summary coming soon.",
      tags: toStringArray(record.tags),
      media,
    };
  });
}

export async function getHomeData(): Promise<HomeData> {
  if (!sanityClient) return fallbackHomeData;

  try {
    const [settings, projects, certifications, events] = await Promise.all([
      sanityClient.fetch(settingsQuery),
      sanityClient.fetch(projectsQuery),
      sanityClient.fetch(certificationsQuery),
      sanityClient.fetch(eventsQuery),
    ]);

    return {
      settings: normalizeSettings(settings),
      projects: normalizeProjects(projects),
      certifications: normalizeCertifications(certifications),
      events: normalizeEvents(events),
    };
  } catch {
    return fallbackHomeData;
  }
}
