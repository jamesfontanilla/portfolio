export type SiteSettings = {
  name: string;
  role: string;
  tagline: string;
  summary: string;
  intro: string;
  bio: string;
  location: string;
  availability: string;
  email: string;
  phoneNumber?: string;
  githubUrl: string;
  linkedinUrl: string;
  xUrl?: string;
  threadsUrl?: string;
  resumeUrl: string;
  facebookUrl?: string;
  instagramUrl?: string;
};

export type Project = {
  title: string;
  summary: string;
  status: string;
  stack: string[];
  impact: string;
  coverImage?: {
    url?: string;
    asset?: unknown;
    alt: string;
  };
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
};

export type Certification = {
  title: string;
  issuer: string;
  earnedOn: string;
  verificationUrl?: string;
};

export type PortfolioEvent = {
  title: string;
  type: string;
  role: string;
  date: string;
  location?: string;
  summary: string;
  tags: string[];
  media?: {
    url?: string;
    asset?: unknown;
    alt: string;
  };
};

export type HomeData = {
  settings: SiteSettings;
  projects: Project[];
  certifications: Certification[];
  events: PortfolioEvent[];
};
