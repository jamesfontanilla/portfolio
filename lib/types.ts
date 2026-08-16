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

export type PortfolioImage = {
  url?: string;
  asset?: unknown;
  alt: string;
};

export type Project = {
  slug?: string;
  title: string;
  summary: string;
  status: string;
  stack: string[];
  impact: string;
  role?: string;
  period?: string;
  challenge?: string;
  contribution?: string;
  outcome?: string;
  evidence?: string;
  coverImage?: PortfolioImage;
  photos?: PortfolioImage[];
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
};

export type Competition = {
  title: string;
  summary: string;
  status: string;
  tags: string[];
  impact: string;
  role?: string;
  period?: string;
  challenge?: string;
  contribution?: string;
  outcome?: string;
  evidence?: string;
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

export type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  body?: unknown[];
  coverImage?: {
    url?: string;
    asset?: unknown;
    alt: string;
  };
  tags: string[];
  publishedAt: string;
  featured?: boolean;
};

export type HomeData = {
  settings: SiteSettings;
  projects: Project[];
  competitions: Competition[];
  certifications: Certification[];
  events: PortfolioEvent[];
  blogPosts?: BlogPost[];
};
