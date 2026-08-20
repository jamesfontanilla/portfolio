import type { HomeData } from "@/lib/types";

export const fallbackHomeData: HomeData = {
  settings: {
    name: "James Fontanilla",
    role: "AI & Full-Stack Developer",
    tagline: "Building AI-powered products, engineering solutions, and opportunities for others.",
    summary:
      "Computer Engineering student building AI-powered and full-stack products, exploring engineering through robotics and competitions, and creating opportunities for students through technology communities.",
    intro: "Build / Engineer / Contribute",
    bio: "I'm a Computer Engineering student who likes building things and figuring out how they work. Most of what I do revolves around AI, software engineering, robotics, and tech communities.\n\nI've built and shipped AI and full-stack projects, competed in hackathons, and represented the Philippines at the VEX Robotics World Championship with QCU2. Outside of projects and competitions, I help grow technology communities and create opportunities for students, including through Microsoft Student Community - QCU.\n\nI'm interested in how technology can be used not just to build products, but also to give more people access to knowledge, communities, and opportunities. I'm currently exploring AI, writing about what I learn, and building things that I hope other people can actually use.",
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
      title: "Microsoft Student Community — QCU",
      summary: "A student-led technology community I helped co-found at QCU to make learning, mentorship, and opportunities more accessible to students.",
      status: "Community Building",
      stack: ["Community Building", "Leadership", "Events", "Partnerships", "Student Programs"],
      impact: "Impact: created a repeatable community surface for students to learn, meet practitioners, and access opportunities through technology.",
      role: "Co-Founder & Executive Vice President",
      period: "Current",
      challenge: "Make technical learning and professional opportunity feel more accessible to students through a student-led community.",
      contribution: "Helped co-found and grow MSC-QCU, shaping community direction, coordinating initiatives, and creating pathways for events, partnerships, and student participation.",
      outcome: "A leadership track record grounded in execution: building an organization and the conditions for other students to learn and connect.",
      evidence: "Organization page, community events, partnerships, and initiative materials available on request.",
      featured: true,
    },
    {
      title: "SceneAtlas",
      summary: "A cinematic movie-research SaaS for search, AI insight generation, spoiler-aware analysis, and personal film organization.",
      status: "Product MVP",
      stack: ["Next.js", "TypeScript", "NestJS", "PostgreSQL", "Prisma", "Wikidata"],
      impact: "Impact: turns movie discovery into a structured research experience.",
      coverImage: { url: "/project-covers/sceneatlas.png", alt: "SceneAtlas homepage" },
      repoUrl: "https://github.com/jamesfontanilla/SceneAtlas",
      featured: true,
    },
    {
      title: "DevLoom",
      summary: "A developer-first link-in-bio SaaS that expands a simple profile into a lightweight developer homepage with projects and analytics.",
      status: "Product MVP",
      stack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Zod"],
      impact: "Impact: gives developers a more expressive home for their work than a list of links.",
      repoUrl: "https://github.com/jamesfontanilla/DevLoom",
      featured: false,
    },
    {
      title: "Elyqora",
      summary: "A connected productivity and operations workspace with multi-tenant identity, workspaces, files, documents, tasks, notes, and structured data.",
      status: "Platform MVP",
      stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "RLS"],
      impact: "Impact: brings core operations modules into one permission-aware workspace.",
      repoUrl: "https://github.com/jamesfontanilla/Elyqora",
      featured: false,
    },
    {
      title: "CSNexus",
      summary: "A Filipino Civil Service Examination learning platform with lessons, adaptive quizzes, mock exams, flashcards, and gamified progress.",
      status: "Learning Platform",
      stack: ["React", "TypeScript", "Vite", "FastAPI", "SQLAlchemy", "IndexedDB"],
      impact: "Impact: makes structured CSE preparation more accessible and practice-oriented.",
      repoUrl: "https://github.com/jamesfontanilla/csnexus",
      featured: false,
    },
    {
      title: "LexiLoop",
      summary: "A vocabulary-learning workspace that combines dictionary lookup, contextual discovery, saved words, and authenticated learning progress.",
      status: "Learning MVP",
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Dictionary API", "Datamuse"],
      impact: "Impact: turns vocabulary building into a repeatable, searchable learning loop.",
      repoUrl: "https://github.com/jamesfontanilla/LexiLoop",
      featured: false,
    },
    {
      title: "Rowverge",
      summary: "A Dataset-to-API product that turns CSV, JSON, and XLSX uploads into immutable, versioned REST APIs.",
      status: "Developer Tool",
      stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Cloudflare R2", "AWS SDK"],
      impact: "Impact: shortens the path from messy tabular data to a dependable API surface.",
      repoUrl: "https://github.com/jamesfontanilla/Rowverge",
      featured: false,
    },
    {
      title: "Rookspan",
      summary: "A landscape-first 3D web expedition game about salvage runs, route decisions, hazards, extraction, and cloud-synced base growth.",
      status: "Game Prototype",
      stack: ["React", "TypeScript", "Vite", "Three.js", "Supabase"],
      impact: "Impact: packages risk, exploration, and resource management into a focused browser game loop.",
      coverImage: { url: "/project-covers/rookspan.png", alt: "Rookspan homepage" },
      repoUrl: "https://github.com/jamesfontanilla/Rookspan",
      featured: false,
    },
    {
      title: "GridWeaver",
      summary: "A fictional 2.5D strategy and drafting game about civic systems architects weaving resilient infrastructure across floating Lumen Boroughs.",
      status: "Game Prototype",
      stack: ["React", "TypeScript", "Vite", "Three.js", "Zustand"],
      impact: "Impact: makes infrastructure planning tangible through a local-first strategic play experience.",
      repoUrl: "https://github.com/jamesfontanilla/gridweaver",
      featured: false,
    },
    {
      title: "Nodivra",
      summary: "A claymorphic developer link-in-bio and proof-of-work profile for combining links, projects, writing, and provider snapshots.",
      status: "Product MVP",
      stack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
      impact: "Impact: reframes a developer profile as a tactile, proof-oriented personal workspace.",
      repoUrl: "https://github.com/jamesfontanilla/Nodivra",
      featured: false,
    },
    {
      title: "Merewake",
      summary: "A playable browser adventure about Signal Keepers restoring a chain of quiet islands through exploration, tuning, and local-first progression.",
      status: "Game Prototype",
      stack: ["React", "TypeScript", "Vite", "Three.js", "Supabase", "WebSockets"],
      impact: "Impact: creates a complete, replayable narrative loop that works even without an account or network.",
      repoUrl: "https://github.com/jamesfontanilla/Merewake",
      featured: false,
    },
    {
      title: "Rillforge",
      summary: "An original voxel exploration, building, crafting, and survival sandbox shaped around rivers, handmade settlements, and changing terrain.",
      status: "Game Prototype",
      stack: ["React", "TypeScript", "Vite", "Three.js", "Fastify", "Supabase"],
      impact: "Impact: combines procedural terrain, survival systems, and local-first persistence in an original browser world.",
      repoUrl: "https://github.com/jamesfontanilla/Rillforge",
      featured: false,
    },
    {
      title: "Aralivo",
      summary: "A private, free-first college learning workspace with study, practice, focus, planner, and learning-record workflows.",
      status: "Learning Workspace",
      stack: ["React", "TypeScript", "Vite", "FastAPI", "Alembic", "Supabase"],
      impact: "Impact: keeps the learning loop usable without paywalls, billing, or external credentials.",
      repoUrl: "https://github.com/jamesfontanilla/Aralivo",
      featured: false,
    },
    {
      title: "Portfolio 3D",
      summary: "A 3D portfolio experience that uses spatial interaction and immersive presentation to turn project browsing into a visual journey.",
      status: "Interactive Portfolio",
      stack: ["Next.js", "React", "Three.js", "React Three Fiber", "Sanity"],
      impact: "Impact: explores how spatial interfaces can make a portfolio feel like an experience rather than a catalogue.",
      featured: false,
    },
    {
      title: "RouteQuilt",
      summary: "A collaborative travel-planning workspace with seeded trips, protected workspaces, itinerary planning, sharing, and a synced 3D globe.",
      status: "Product MVP",
      stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Radix UI", "Zod"],
      impact: "Impact: gives trip collaborators a shared planning surface with a clear path from demo to production data.",
      repoUrl: "https://github.com/jamesfontanilla/RouteQuilt",
      featured: false,
    },
  ],
  competitions: [
    {
      slug: "vex-robotics-world-championship-qcu2",
      title: "VEX Robotics World Championship — QCU2",
      summary: "QCU2 — Beta represented Quezon City University and the Philippines at the 2026 VEX Robotics World Championship, finishing 29th in Research Division qualifications and 50th in World Robot Skills.",
      status: "International Robotics",
      tags: ["Robotics", "Engineering Documentation", "Team Collaboration", "VEX"],
      body: `# 🌎 VEX Robotics World Championship 2026

**April 25–27, 2026 — St. Louis, Missouri, USA**

On April 22, I left the Philippines with the **Quezon City University Robotics Team** for an opportunity I never expected to experience during my freshman year: competing at the **2026 VEX Robotics World Championship** in St. Louis, Missouri.

From April 25–27, **QCU2 – Beta** competed alongside university teams from around the world, representing both **Quezon City University and the Philippines** on an international stage. QCU's official results placed QCU2 **50th out of 84 teams in the World Skills Challenge**, while the team finished **29th out of 40 teams in its Research Division qualification ranking**. ([Quezon City University][1])

Across the full **2025–2026 season**, QCU2 also achieved a **78th out of 266 global VEX U ranking**, reflecting the team's performance across the entire season beyond the World Championship event.

## 🇵🇭 Representing the Philippines

For me, the experience was especially significant because I was a **first-year Computer Engineering student and the only freshman on our team**.

I joined QCU2 after consistently showing up around the robotics team and eventually getting the opportunity to work alongside teammates with considerably more experience.

I served as one of our **Engineering Notebook Managers**, where my role focused on documenting the engineering work behind the robot.

My responsibilities included:

* 📖 Documenting programming logic, code changes, and software development
* 📝 Organizing the structure and presentation of our Engineering Notebook
* 🔄 Recording design iterations, testing, and engineering decisions
* 💻 Helping preserve the technical reasoning behind the team's development process

The experience taught me that engineering isn't only about building something that works.

It's also about being able to **explain why it works, how it evolved, and what you learned when it didn't.**

## 🤖 Competing on the World Stage

QCU2 competed in the **Research Division**, alongside university teams from countries including the United States, Canada, China, Mexico, and others. The official 2026 team list includes QCU2 – Beta QCU among the participating college teams. ([RECF][2])

Across the qualification matches, QCU2 finished:

> **29th out of 40 teams in the Research Division**

The team ultimately fell just short of advancing to the elimination rounds, but the experience itself was invaluable.

We also finished:

> **50th out of 84 teams in the World Robot Skills Challenge**

QCU's official report notes that both QCU teams performed strongly on the global stage, placing the university among the competing teams from around the world. ([Quezon City University][1])

## 📖 Engineering Beyond the Robot

One of the biggest lessons I took away from Worlds was the importance of **engineering documentation**.

The robot on the field is only the visible result.

Behind it are:

**Ideas → Design → Code → Testing → Failure → Iteration → Improvement → Final System**

As a Notebook Manager, I had the responsibility of helping capture that process.

That changed how I think about engineering.

A good engineer doesn't simply build.

> **A good engineer understands, documents, tests, and learns from the decisions behind what they build.**

## 🌍 What I Took Home

I left St. Louis with much more than competition results.

I gained experience working with a team of engineers under international competition conditions, learned from teammates with more experience than me, and saw firsthand the level of engineering being practiced by university teams around the world.

Most importantly, it showed me that **being early in your engineering journey doesn't mean you have to wait before stepping onto a global stage.**

Sometimes, you just have to show up, take the opportunity when it appears, and be willing to learn.

### 🇵🇭 QCU2 — Beta

**VEX Robotics Philippine National Championship 2026**

🏆 Design Award
🥈 Robot Skills — 2nd Place
🥈 Tournament Finalists

↓

**2026 VEX Robotics World Championship**

🌎 Represented the Philippines
🎯 29th / 40 — Research Division Qualifications
🌍 78th / 266 — Global VEX U Ranking (2025–2026 season)
🤖 50th / 84 — World Robot Skills Challenge

**From simply showing up to competing on the world stage.**

[1]: https://qcu.edu.ph/qcu-robotics-team-earns-global-ranking-at-the-2026-vex-robotics-world-championship/?utm_source=chatgpt.com "Quezon City University — QCU Robotics Team Earns Global Ranking"
[2]: https://recf.org/documents/2026/04/research-division-list-vurc-2026-vex-robotics-world-championship.pdf/?utm_source=chatgpt.com "Team List — 2026 VEX Robotics World Championship"`,
      featured: true,
    },
    {
      slug: "vex-robotics-philippine-national-championship-2026",
      title: "VEX Robotics Philippine National Championship 2026",
      summary: "QCU2 earned the Design Award, Robot Skills — 2nd Place, and Tournament Finalist honors at the 2026 Philippine National Championship.",
      status: "National Robotics",
      tags: ["Robotics", "Engineering Documentation", "Robot Skills", "VEX", "QCU2"],
      body: `# 🇵🇭 VEX Robotics Philippine National Championship 2026

**January 29-30, 2026**

On January 29-30, 2026, **QCU2** competed at the **VEX Robotics Philippine National Championship**, putting months of engineering, iteration, documentation, and teamwork to the test.

What started as a robotics project became an opportunity to compete alongside some of the strongest teams in the country—and ultimately produced three major results:

* 🏆 **Design Award**
* 🥈 **Robot Skills — 2nd Place**
* 🥈 **Tournament Finalists**

## 🏆 Design Award

One of our biggest achievements was receiving the **Design Award**, a judged recognition centered on the team's engineering design process.

The award isn't simply about having an impressive robot. VEX places significant emphasis on how teams **design, document, iterate, innovate, and explain the decisions behind their robot**. Teams are expected to demonstrate ownership of their engineering process and be able to defend their design decisions.

For QCU2, this meant documenting how our robot evolved, why particular design decisions were made, and how testing and iteration shaped the final system.

Receiving the Design Award was therefore a recognition not only of the robot we built, but of the **engineering process behind it**.

## 🥈 Robot Skills — 2nd Place

We also finished **2nd Place in Robot Skills**.

Robot Skills combines **Driving Skills** and **Autonomous Coding Skills**, with teams ranked according to their combined performance.

Finishing second nationally demonstrated our ability to translate the robot's engineering design into competitive performance under the pressure of the championship.

## 🥈 Tournament Finalists

Our run also took us all the way to the **Tournament Finals**, where QCU2 competed for the championship.

Reaching the finals was a different kind of validation from Robot Skills. It showed that our robot and team could perform not only in individual skills runs, but also in the head-to-head tournament environment.

We ultimately finished as **Tournament Finalists**—just short of the championship, but proud of how far the team had progressed.

---

## More Than Three Awards

Looking back, the results were more than a collection of trophies.

**Design Award**
→ Our engineering process and documentation mattered.

**Robot Skills 2nd Place**
→ Our robot could perform at a high competitive level.

**Tournament Finalists**
→ We could compete deep into the championship tournament.

Together, these results represented three different dimensions of the same thing:

> **Engineering something, understanding why you built it, and making it perform when it matters.**

For me personally, this championship became one of the experiences that showed how quickly engineering can move from something learned in the classroom to something tested in a real competitive environment.

And this was only the beginning of my VEX journey.

**QCU2 → Philippine National Championship → VEX Robotics World Championship 🇵🇭🌎**`,
      photos: [],
      featured: false,
    },
    {
      slug: "sparkfest-2026-orderly-ops-chronisync",
      title: "SparkFest 2026 — Orderly Ops",
      summary: "Team Orderly Ops reached the Top 10 Finalists at SparkFest 2026 with ChroniSync, an AI-assisted chronic disease monitoring platform.",
      status: "Hackathon Finalist",
      tags: ["Hackathon", "Healthcare AI", "Gemini", "Firebase", "Community Impact", "Orderly Ops"],
      body: `# ⚡ SparkFest 2026

**June 28–July 9, 2026 — Bulwagang Bonifacio, PUP Manila**

SparkFest 2026 was the flagship hackathon of **Google Developer Groups on Campus PUP**, bringing students from technical, creative, and managerial backgrounds together to build solutions for real-world and community challenges.

## 🩺 Our project: ChroniSync

With **Team Orderly Ops**, we built **ChroniSync**, an AI-assisted chronic disease monitoring platform connecting patients, caregivers, and physicians.

ChroniSync supports four chronic conditions:

* Type 2 diabetes
* Hypertension
* Chronic kidney disease
* Chronic obstructive pulmonary disease (COPD)

Patients can log vitals, medications, symptoms, and daily check-ins. The platform then contextualizes that information against disease-specific clinical guidelines and produces AI-assisted summaries, trend explanations, and rule-based alerts.

The system was designed as a transparent, clinician-reviewable coordination layer—not as a diagnosis engine.

## 🏅 Top 10 Finalists

Team Orderly Ops was named one of the **Top 10 Finalists** of SparkFest 2026 with ChroniSync.

Reaching the finalist stage validated more than the prototype itself. It recognized the team's ability to connect a meaningful healthcare problem with a practical, guideline-grounded technology solution.

## 🧠 Google technologies

ChroniSync used Google technologies across its application stack:

* **Gemini API** for AI-assisted document extraction and visit and trend summarization
* **Firebase Authentication** for sign-in, registration, password reset, and role-based routing
* **Cloud Firestore** for clinical and portal data
* **Firebase Storage** for patient documents and files
* **Firebase Admin SDK** for secure server-side access

## 🌱 From prototype to impact

SparkFest was built around a simple idea: technology should move beyond a demo and create value for a real community.

ChroniSync became our response to that challenge—a platform focused on helping people manage ongoing health conditions while giving caregivers and physicians a clearer view of the patient's journey.

For me, the hackathon was an opportunity to practice engineering in a team, build with Google technologies, and turn a healthcare concept into a working product under a real deadline.

**Orderly Ops → ChroniSync → SparkFest 2026 Top 10 Finalists**

[1]: https://sparkfest.gdgpup.org/ "SparkFest 2026 — GDG on Campus PUP"
[2]: https://github.com/jamesfontanilla/chronisync "ChroniSync on GitHub"`,
      photos: [],
      featured: false,
    },
    {
      slug: "cryptita-plays-builder-showcase-wocee-2026-aralivo",
      title: "Cryptita Plays Builder Showcase @ WOCEE 2026 — Aralivo",
      summary: "As a solo builder, James Fontanilla was selected as one of 20 finalists to present Aralivo at the Cryptita Plays Builder Showcase @ WOCEE 2026.",
      status: "Top 20 Finalist · Solo Builder",
      tags: ["Builder Showcase", "Education Technology", "React", "FastAPI", "Supabase", "Stellar", "Solo Builder", "Aralivo"],
      body: `# 💜 Cryptita Plays Builder Showcase @ WOCEE 2026

**August 8, 2026 — SMX Convention Center Manila**

I was selected as one of the **20 finalists** for the first **Cryptita Plays Builder Showcase @ WOCEE 2026**, presenting **Aralivo** as a solo builder.

The showcase brought together students, startups, developers, researchers, creators, and innovators to put existing projects in front of industry leaders, ecosystem partners, and the wider technology community. Cryptita Plays described the event as a builder showcase rather than an on-site hackathon—an opportunity to show what had already been built, receive feedback, and open the door to what could come next.

## 📚 The project: Aralivo

**Aralivo** is a private, free-first college learning workspace built around one simple loop:

> **Learn a concept → retrieve it → receive useful feedback → save progress → continue.**

The product is designed for undergraduate students who need a steady place to study without the pressure of public leaderboards, paywalls, or a noisy social layer.

## 🧭 The learning workspace

Aralivo brings the core study journey into one connected space:

* **Today** keeps the next useful learning action close.
* **Subjects, units, and lessons** give learning a clear progression.
* **Practice and flashcards** support retrieval instead of passive reading.
* **Focus** helps students protect time for deliberate work.
* **Planner** turns intentions into tasks and supports calendar export.
* **Resources and notes** keep supporting material close to the lesson.
* **Receipts** let learners keep optional, privacy-safe records of milestones.

The system also treats loading, empty, offline, retry, saved, and error states as part of the learning experience—not as edge cases to hide.

## 🧰 How it is built

Aralivo's repository combines a responsive **React/Vite** product shell with a **FastAPI** API and explicit **Alembic** database migrations.

Its architecture includes:

* **Supabase Auth and Postgres** for identity and persistence
* **Row-level security and ownership checks** for user-owned learning data
* **Validated content contracts** for lessons and question banks
* **Idempotent completion, XP, focus, calendar, and receipt operations**
* Optional provider adapters for AI-assisted workflows, scholarly metadata, open learning resources, email delivery, and Google Calendar
* A **Stellar** receipt path that anchors only a hash while keeping the readable learning record private

Those boundaries matter because Aralivo is intentionally not an LMS, grading authority, social network, marketplace, or paid subscription product. Learning receipts are personal records—not official credentials.

## 🏅 Top 20 finalist — solo builder

Being selected among the 20 finalists gave Aralivo a chance to be evaluated beyond the repository and the interface. I had to communicate the problem, the product boundary, and the reason for designing a quieter, privacy-conscious learning workspace.

The experience reinforced something I care about in engineering: a good product is not just a collection of features. It is a set of deliberate decisions about what the product should protect, what it should make easier, and what it should refuse to become.

## 🌱 What I took from the showcase

Aralivo started as an attempt to keep learning practical and personal. Presenting it as a solo builder turned that idea into a conversation with other builders, judges, and people working on technology for real communities.

The showcase reminded me that even an early product can be worth sharing when its constraints are intentional and its purpose is clear.

**Solo builder → Aralivo → Cryptita Plays Builder Showcase @ WOCEE 2026**

[1]: https://luma.com/uz2h06kc "Cryptita Plays Builder Showcase @ WOCEE 2026"
[2]: https://ph.linkedin.com/company/cryptitaplays "Cryptita Plays on LinkedIn"
[3]: https://github.com/jamesfontanilla/Aralivo "Aralivo on GitHub"`,
      photos: [],
      featured: false,
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
      title: "Hello, World! Your First Steps into AI and Microsoft",
      type: "Workshop",
      role: "Attendee",
      date: "2026-07-31",
      location: "Philippines / Online",
      summary: "An introductory session on getting started with AI and Microsoft technologies, designed to help learners take their first practical steps.",
      tags: ["AI", "Microsoft", "Learning"],
    },
    {
      title: "AppBuildersPH Meetup: Shipaton Edition",
      type: "Meetup",
      role: "Attendee",
      date: "2026-07-30",
      location: "Philippines / Online",
      summary: "A builder-focused meetup about turning ideas into shipped products through rapid prototyping, collaboration, and practical delivery lessons.",
      tags: ["App Building", "Community", "Product"],
    },
    {
      title: "AWSPEAK Victory: Fail Forward Fluently",
      type: "Meetup",
      role: "Attendee",
      date: "2026-07-30",
      location: "Philippines / Online",
      summary: "A community session on learning from setbacks, iterating with confidence, and building stronger cloud projects through continuous improvement.",
      tags: ["AWS", "Cloud", "Community"],
    },
    {
      title: "Seekers Guild Open Table: Compass and Conversation VI",
      type: "Community Event",
      role: "Learner",
      date: "2026-07-26",
      location: "Philippines / Online",
      summary: "An open conversation space for exchanging perspectives, finding direction, and connecting with other curious members of the community.",
      tags: ["Community", "Conversation", "Networking"],
    },
    {
      title: "WordPress Manila Meetup - July 2026",
      type: "Meetup",
      role: "Attendee",
      date: "2026-07-25",
      location: "Manila",
      summary: "A WordPress community gathering covering practical web building, publishing, and the ideas shaping the local WordPress ecosystem.",
      tags: ["WordPress", "Web Development", "Community"],
    },
    {
      title: "Build Nights: Data Pipelines & Analytics Dashboard with Kiro",
      type: "Workshop",
      role: "Attendee",
      date: "2026-07-24",
      location: "Philippines / Online",
      summary: "A hands-on build night for connecting data pipelines to an analytics dashboard with Kiro and turning raw data into useful product insights.",
      tags: ["Kiro", "Data Engineering", "Analytics"],
    },
    {
      title: "AWSUG PH July Meetup: Amazon Connect",
      type: "Meetup",
      role: "Attendee",
      date: "2026-07-23",
      location: "Philippines / Online",
      summary: "A user-group session exploring Amazon Connect and the cloud building blocks behind modern customer service experiences.",
      tags: ["AWS", "Amazon Connect", "Cloud"],
    },
    {
      title: "AWS BuilderCards Game Night",
      type: "Game Night",
      role: "Participant",
      date: "2026-07-20",
      location: "Philippines / Online",
      summary: "A playful AWS learning session using BuilderCards to reinforce cloud concepts through collaboration, problem-solving, and friendly competition.",
      tags: ["AWS", "Learning", "Community"],
    },
    {
      title: "AI Pilipinas Meetup #33: Claude Code Masterclass",
      type: "Masterclass",
      role: "Attendee",
      date: "2026-07-18",
      location: "Philippines / Online",
      summary: "A practical masterclass on using Claude Code to work more effectively with AI-assisted software development and developer workflows.",
      tags: ["AI", "Claude Code", "Developer Tools"],
    },
    {
      title: "Build Nights: Full-Stack Web App with Kiro",
      type: "Workshop",
      role: "Attendee",
      date: "2026-07-17",
      location: "Philippines / Online",
      summary: "A guided build session focused on creating a full-stack web application with Kiro, from interface to working application flow.",
      tags: ["Kiro", "Full Stack", "Web Development"],
    },
    {
      title: "[AWS SBG PUP] Building an End-to-End Serverless Data Pipeline with AWS",
      type: "Workshop",
      role: "Attendee",
      date: "2026-07-13",
      location: "PUP, Manila",
      summary: "A practical AWS session on designing an end-to-end serverless data pipeline, connecting ingestion, processing, storage, and analytics.",
      tags: ["AWS", "Serverless", "Data Engineering"],
    },
    {
      title: "Claude Code Manila Meetup #2",
      type: "Meetup",
      role: "Attendee",
      date: "2026-07-11",
      location: "Manila",
      summary: "A local developer meetup for sharing Claude Code workflows, experiments, and practical lessons from building with AI.",
      tags: ["AI", "Claude Code", "Developer Community"],
    },
    {
      title: "[FuseSpark] AI Workflow: The New Speed of Building",
      type: "Workshop",
      role: "Attendee",
      date: "2026-07-11",
      location: "Philippines / Online",
      summary: "A session on how AI-assisted workflows are changing the pace of product development, from idea exploration to implementation.",
      tags: ["AI", "Workflow", "Productivity"],
    },
    {
      title: "Build Nights: Kiro Web Autonomous Agent Workshop",
      type: "Workshop",
      role: "Attendee",
      date: "2026-07-10",
      location: "Philippines / Online",
      summary: "A hands-on workshop exploring autonomous web agents with Kiro and the patterns behind AI-assisted web experiences.",
      tags: ["Kiro", "AI Agents", "Web Development"],
    },
    {
      title: "Microsoft Azure Community Night - July Meetup",
      type: "Meetup",
      role: "Attendee",
      date: "2026-07-10",
      location: "Philippines / Online",
      summary: "A Microsoft Azure community gathering for learning, sharing cloud practices, and connecting with fellow developers and cloud practitioners.",
      tags: ["Microsoft Azure", "Cloud", "Community"],
    },
    {
      title: "Java User Group Philippines Meetup - July 2026",
      type: "Meetup",
      role: "Attendee",
      date: "2026-07-09",
      location: "Philippines / Online",
      summary: "A Java community meetup for exchanging development practices, platform updates, and experiences from the Philippine Java ecosystem.",
      tags: ["Java", "Software Development", "Community"],
    },
    {
      title: "PH Cloud Educators Community Meetup #1",
      type: "Meetup",
      role: "Attendee",
      date: "2026-07-04",
      location: "Philippines / Online",
      summary: "The first community meetup for cloud educators in the Philippines, focused on sharing teaching practices, cloud knowledge, and learning resources.",
      tags: ["Cloud", "Education", "Community"],
    },
    {
      title: "Huawei Cloud Developer Group – Kickoff Event",
      type: "Community Event",
      role: "Attendee",
      date: "2026-06-30",
      location: "Philippines / Online",
      summary: "A kickoff gathering for developers interested in Huawei Cloud, introducing the community and creating space for future technical collaboration.",
      tags: ["Huawei Cloud", "Cloud", "Developer Community"],
    },
    {
      title: "Tempest: Ascend to the Cloud",
      type: "Conference",
      role: "Attendee",
      date: "2026-06-30",
      location: "Philippines / Online",
      summary: "A cloud-focused event about modern infrastructure, platform growth, and the skills needed to move confidently into cloud development.",
      tags: ["Cloud", "Infrastructure", "Learning"],
    },
    {
      title: "AWS Skill Builder Execution Workshop",
      type: "Workshop",
      role: "Learner",
      date: "2026-06-29",
      location: "Philippines / Online",
      summary: "A focused learning workshop for applying AWS Skill Builder lessons through structured practice and hands-on cloud execution.",
      tags: ["AWS", "Cloud Learning", "Hands-On"],
    },
    {
      title: "Celestial Effervescence: Serverless APIs with Lambda + API Gateway",
      type: "Workshop",
      role: "Attendee",
      date: "2026-06-28",
      location: "Philippines / Online",
      summary: "A serverless development session on building and exposing APIs with AWS Lambda and API Gateway.",
      tags: ["AWS", "Serverless", "APIs"],
    },
    {
      title: "Launching Private Alf: Build & Deploy on EC2 with VPC",
      type: "Workshop",
      role: "Attendee",
      date: "2026-06-27",
      location: "Philippines / Online",
      summary: "A practical deployment session covering how to build and run an application on EC2 within a VPC-based AWS network.",
      tags: ["AWS", "EC2", "VPC"],
    },
    {
      title: "Microsoft Build //localhost: Manila",
      type: "Community Event",
      role: "Attendee",
      date: "2026-06-26",
      location: "Manila",
      summary: "A local Microsoft Build gathering bringing developers together to explore announcements, tools, and practical opportunities across the Microsoft platform.",
      tags: ["Microsoft", "Developer Community", "AI"],
    },
    {
      title: "Light up Your AI With Workato Enterprise MCP",
      type: "Workshop",
      role: "Attendee",
      date: "2026-06-23",
      location: "Philippines / Online",
      summary: "A session on connecting AI workflows with enterprise systems through Workato and the Model Context Protocol.",
      tags: ["AI", "MCP", "Automation"],
    },
    {
      title: "Data Engineering Pilipinas Year 3 Meetup",
      type: "Meetup",
      role: "Attendee",
      date: "2026-06-21",
      location: "Philippines / Online",
      summary: "A milestone meetup celebrating three years of the Data Engineering Pilipinas community and sharing practical data engineering knowledge.",
      tags: ["Data Engineering", "Community", "Philippines"],
    },
    {
      title: "Cafe Cursor Manila",
      type: "Meetup",
      role: "Attendee",
      date: "2026-06-16",
      location: "Manila",
      summary: "A casual developer gathering for conversations, co-learning, and exchanging ideas around AI-assisted coding and modern development tools.",
      tags: ["AI", "Developer Tools", "Community"],
    },
    {
      title: "Git It Done: Version Control Basics",
      type: "Workshop",
      role: "Learner",
      date: "2026-06-14",
      location: "Philippines / Online",
      summary: "A beginner-friendly workshop covering the core concepts and everyday workflows of Git and version control.",
      tags: ["Git", "Version Control", "Learning"],
    },
    {
      title: "FIFA × AFC: Agentic Football Cup",
      type: "Competition",
      role: "Participant",
      date: "2026-06-12",
      location: "Philippines / Online",
      summary: "A creative AI competition exploring agentic systems through a football-themed challenge and collaborative building.",
      tags: ["AI Agents", "Competition", "Innovation"],
    },
    {
      title: "GDG Build with AI: The Future of AI and Research",
      type: "Community Event",
      role: "Attendee",
      date: "2026-06-06",
      location: "Philippines / Online",
      summary: "A Google Developer Groups event examining the future of AI, current research directions, and how developers can build with emerging tools.",
      tags: ["AI", "Research", "Google Developer Groups"],
    },
    {
      title: "AWS SBG PUP × PyTorch Philippines: Community Launch and AI Meetup",
      type: "Community Launch",
      role: "Attendee",
      date: "2026-06-05",
      location: "PUP, Manila",
      summary: "A community launch and AI meetup bringing AWS, PyTorch, and local developer communities together for learning and collaboration.",
      tags: ["AI", "AWS", "PyTorch"],
    },
    {
      title: "Microsoft Fabric + Foundry Workshop",
      type: "Workshop",
      role: "Attendee",
      date: "2026-06-03",
      location: "Philippines / Online",
      summary: "A hands-on workshop exploring Microsoft Fabric and Azure AI Foundry for building data and AI solutions on the Microsoft cloud.",
      tags: ["Microsoft Fabric", "Azure AI Foundry", "Data"],
    },
  ],
  blogPosts: [
    {
      title: "Building an OS-style portfolio with Next.js",
      slug: "building-os-portfolio",
      excerpt: "How I built a browser-based desktop OS experience using React, CSS glassmorphism, and the Web Animations API.",
      tags: ["Next.js", "React", "CSS"],
      publishedAt: "2026-07-10",
      featured: true,
    },
  ],
};
