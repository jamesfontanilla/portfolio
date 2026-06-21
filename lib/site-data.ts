import type { HomeData } from "@/lib/types";

export const fallbackHomeData: HomeData = {
  settings: {
    name: "Jaime Fontanilla",
    role: "Frontend Developer",
    tagline: "Premium, app-like portfolio for projects, proof, and contact.",
    summary:
      "A desktop-optimized portfolio inspired by sleek mobile dashboards, rebuilt as a clear workspace for your work, certifications, events, and private publishing.",
    intro: "Available for freelance and collaboration",
    bio: "Design-led, product-minded, and curious about systems.",
    location: "Philippines / Remote",
    availability: "Available for freelance and collaboration",
    email: "jamesfontanilla@outlook.ph",
    phoneNumber: "+639282180937",
    githubUrl: "https://github.com/jamesfontanilla",
    linkedinUrl: "https://www.linkedin.com/in/jamesrfontanilla/",
    xUrl: "https://x.com/thinkaboutjaime",
    threadsUrl: "https://www.threads.com/@jxmsfnt",
    resumeUrl: "#",
    facebookUrl: "https://www.facebook.com/jamesrfontanilla/",
    instagramUrl: "https://www.instagram.com/jxmsnft/",
  },
  projects: [
    {
      title: "Portfolio command center",
      summary:
        "A polished portfolio shell with a dashboard feel, admin publishing, and a clean content structure for projects and proof.",
      status: "Live",
      stack: ["Next.js", "Sanity"],
      impact: "Impact: premium first impression",
      demoUrl: "#",
      repoUrl: "#",
      featured: true,
    },
    {
      title: "Commerce dashboard revamp",
      summary:
        "A conversion-focused redesign with clearer hierarchy, faster scanning, and a more premium visual language.",
      status: "Case Study",
      stack: ["UI / UX", "Product"],
      impact: "Impact: stronger conversion clarity",
    },
    {
      title: "Reusable component kit",
      summary:
        "A personal design system built to speed up future products while keeping the interface cohesive.",
      status: "Open Source",
      stack: ["React", "Design System"],
      impact: "Impact: faster future builds",
    },
  ],
  certifications: [
    {
      title: "Frontend Fundamentals",
      issuer: "Issuer Name",
      earnedOn: "2026-04-01",
      verificationUrl: "#",
    },
    {
      title: "UI Design Systems",
      issuer: "Issuer Name",
      earnedOn: "2026-06-01",
      verificationUrl: "#",
    },
    {
      title: "Cloud Basics",
      issuer: "Issuer Name",
      earnedOn: "2026-07-01",
      verificationUrl: "#",
    },
  ],
  events: [
    {
      title: "Developer Summit Manila",
      type: "Conference",
      role: "Attendee",
      date: "2026-05-12",
      location: "Manila",
      summary:
        "Showcase event photos, a recap, and what you learned. This card can be expanded into a post detail page later.",
      tags: ["Media", "Conference"],
    },
    {
      title: "Hackathon weekend",
      type: "Hackathon",
      role: "Participant",
      date: "2026-03-18",
      summary: "Team shot, prototype screenshots, and a short summary.",
      tags: ["Prototype", "Team"],
    },
    {
      title: "Community meetup",
      type: "Meetup",
      role: "Speaker",
      date: "2026-02-08",
      summary: "Speaker photo, notes, and the topics you discussed.",
      tags: ["Talk", "Community"],
    },
    {
      title: "Workshop / bootcamp",
      type: "Workshop",
      role: "Learner",
      date: "2026-01-20",
      summary: "Certificates, event badge, and a media gallery.",
      tags: ["Learning", "Media"],
    },
  ],
};
