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
  githubUrl,
  linkedinUrl,
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
      settings: settings ?? fallbackHomeData.settings,
      projects: projects?.length ? projects : fallbackHomeData.projects,
      certifications: certifications?.length ? certifications : fallbackHomeData.certifications,
      events: events?.length ? events : fallbackHomeData.events,
    };
  } catch {
    return fallbackHomeData;
  }
}
