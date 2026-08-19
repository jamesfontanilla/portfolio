insert into public.content_entries (kind, slug, title, status, featured, data)
values
  ('settings', 'site-settings', 'James Fontanilla', 'published', true, '{"name":"James Fontanilla","role":"AI & Full-Stack Developer","tagline":"Building AI-powered products, engineering solutions, and opportunities for others.","summary":"Computer Engineering student building AI-powered and full-stack products, exploring engineering through robotics and competitions, and creating opportunities for students through technology communities.","intro":"Build / Engineer / Contribute","bio":"I''m a Computer Engineering student who likes building things and figuring out how they work. Most of what I do revolves around AI, software engineering, robotics, and tech communities.\n\nI''ve built and shipped AI and full-stack projects, competed in hackathons, and represented the Philippines at the VEX Robotics World Championship with QCU2. Outside of projects and competitions, I help grow technology communities and create opportunities for students, including through Microsoft Student Community - QCU.\n\nI''m interested in how technology can be used not just to build products, but also to give more people access to knowledge, communities, and opportunities. I''m currently exploring AI, writing about what I learn, and building things that I hope other people can actually use.","location":"Philippines / Remote","availability":"Available for freelance and collaboration","email":"jamesfontanilla@outlook.ph","phoneNumber":"+639282180937","githubUrl":"https://github.com/jamesfontanilla","linkedinUrl":"https://www.linkedin.com/in/jamesrfontanilla/","xUrl":"https://x.com/thinkaboutjaime","threadsUrl":"https://www.threads.com/@jxmsfnt","resumeUrl":"#","facebookUrl":"https://www.facebook.com/jamesrfontanilla/","instagramUrl":"https://www.instagram.com/jxmsnft/"}'::jsonb),
  ('competition', 'vex-robotics-world-championship-qcu2', 'VEX Robotics World Championship — QCU2', 'published', true, '{"summary":"An engineering and documentation record from representing the Philippines at the VEX Robotics World Championship with QCU2.","status":"International Robotics","tags":["Robotics","Engineering Documentation","Team Collaboration","VEX"],"body":"## The challenge\n\nTurn a complex season of robot design, iteration, and team decisions into a clear, competition-ready engineering record while supporting the team at an international event.\n\n## My contribution\n\nMaintained the engineering notebook, organized the team’s build narrative and evidence, and helped represent the Philippines with QCU2 at the VEX Robotics World Championship.\n\n## Outcome\n\nA bridge between hands-on engineering, technical communication, and international representation—evidence of disciplined execution beyond software projects.\n\n## Evidence\n\nCompetition documentation and engineering notebook materials available on request.","photos":[],"featured":true}'::jsonb),
  ('project', 'microsoft-student-community-qcu', 'Microsoft Student Community — QCU', 'published', true, '{"summary":"A student-led technology community I helped co-found at QCU to make learning, mentorship, and opportunities more accessible to students.","status":"Community Building","stack":["Community Building","Leadership","Events","Partnerships","Student Programs"],"impact":"Impact: created a repeatable community surface for students to learn, meet practitioners, and access opportunities through technology.","role":"Co-Founder & Executive Vice President","period":"Current","challenge":"Make technical learning and professional opportunity feel more accessible to students through a student-led community.","contribution":"Helped co-found and grow MSC-QCU, shaping community direction, coordinating initiatives, and creating pathways for events, partnerships, and student participation.","outcome":"A leadership track record grounded in execution: building an organization and the conditions for other students to learn and connect.","evidence":"Organization page, community events, partnerships, and initiative materials available on request.","featured":true}'::jsonb),
  ('project', 'sceneatlas', 'SceneAtlas', 'published', true, '{"summary":"A cinematic movie-research SaaS for search, AI insight generation, spoiler-aware analysis, and personal film organization.","status":"Product MVP","stack":["Next.js","TypeScript","NestJS","PostgreSQL","Prisma","Wikidata"],"impact":"Impact: turns movie discovery into a structured research experience.","coverImage":"/project-covers/sceneatlas.png","repoUrl":"https://github.com/jamesfontanilla/SceneAtlas","featured":true}'::jsonb),
  ('project', 'devloom', 'DevLoom', 'published', false, '{"summary":"A developer-first link-in-bio SaaS that expands a simple profile into a lightweight developer homepage with projects and analytics.","status":"Product MVP","stack":["Next.js","TypeScript","Supabase","Tailwind CSS","Zod"],"impact":"Impact: gives developers a more expressive home for their work than a list of links.","repoUrl":"https://github.com/jamesfontanilla/DevLoom","featured":false}'::jsonb),
  ('project', 'elyqora', 'Elyqora', 'published', false, '{"summary":"A connected productivity and operations workspace with multi-tenant identity, workspaces, files, documents, tasks, notes, and structured data.","status":"Platform MVP","stack":["Next.js","TypeScript","Supabase","PostgreSQL","RLS"],"impact":"Impact: brings core operations modules into one permission-aware workspace.","repoUrl":"https://github.com/jamesfontanilla/Elyqora","featured":false}'::jsonb),
  ('project', 'csnexus', 'CSNexus', 'published', false, '{"summary":"A Filipino Civil Service Examination learning platform with lessons, adaptive quizzes, mock exams, flashcards, and gamified progress.","status":"Learning Platform","stack":["React","TypeScript","Vite","FastAPI","SQLAlchemy","IndexedDB"],"impact":"Impact: makes structured CSE preparation more accessible and practice-oriented.","repoUrl":"https://github.com/jamesfontanilla/csnexus","featured":false}'::jsonb),
  ('project', 'lexiloop', 'LexiLoop', 'published', false, '{"summary":"A vocabulary-learning workspace that combines dictionary lookup, contextual discovery, saved words, and authenticated learning progress.","status":"Learning MVP","stack":["Next.js","TypeScript","Tailwind CSS","Supabase","Dictionary API","Datamuse"],"impact":"Impact: turns vocabulary building into a repeatable, searchable learning loop.","repoUrl":"https://github.com/jamesfontanilla/LexiLoop","featured":false}'::jsonb),
  ('project', 'rowverge', 'Rowverge', 'published', false, '{"summary":"A Dataset-to-API product that turns CSV, JSON, and XLSX uploads into immutable, versioned REST APIs.","status":"Developer Tool","stack":["Next.js","TypeScript","Supabase","PostgreSQL","Cloudflare R2","AWS SDK"],"impact":"Impact: shortens the path from messy tabular data to a dependable API surface.","repoUrl":"https://github.com/jamesfontanilla/Rowverge","featured":false}'::jsonb),
  ('project', 'rookspan', 'Rookspan', 'published', false, '{"summary":"A landscape-first 3D web expedition game about salvage runs, route decisions, hazards, extraction, and cloud-synced base growth.","status":"Game Prototype","stack":["React","TypeScript","Vite","Three.js","Supabase"],"impact":"Impact: packages risk, exploration, and resource management into a focused browser game loop.","coverImage":"/project-covers/rookspan.png","repoUrl":"https://github.com/jamesfontanilla/Rookspan","featured":false}'::jsonb),
  ('project', 'gridweaver', 'GridWeaver', 'published', false, '{"summary":"A fictional 2.5D strategy and drafting game about civic systems architects weaving resilient infrastructure across floating Lumen Boroughs.","status":"Game Prototype","stack":["React","TypeScript","Vite","Three.js","Zustand"],"impact":"Impact: makes infrastructure planning tangible through a local-first strategic play experience.","repoUrl":"https://github.com/jamesfontanilla/gridweaver","featured":false}'::jsonb),
  ('project', 'nodivra', 'Nodivra', 'published', false, '{"summary":"A claymorphic developer link-in-bio and proof-of-work profile for combining links, projects, writing, and provider snapshots.","status":"Product MVP","stack":["Next.js","TypeScript","Supabase","Tailwind CSS"],"impact":"Impact: reframes a developer profile as a tactile, proof-oriented personal workspace.","repoUrl":"https://github.com/jamesfontanilla/Nodivra","featured":false}'::jsonb),
  ('project', 'merewake', 'Merewake', 'published', false, '{"summary":"A playable browser adventure about Signal Keepers restoring a chain of quiet islands through exploration, tuning, and local-first progression.","status":"Game Prototype","stack":["React","TypeScript","Vite","Three.js","Supabase","WebSockets"],"impact":"Impact: creates a complete, replayable narrative loop that works even without an account or network.","repoUrl":"https://github.com/jamesfontanilla/Merewake","featured":false}'::jsonb),
  ('project', 'rillforge', 'Rillforge', 'published', false, '{"summary":"An original voxel exploration, building, crafting, and survival sandbox shaped around rivers, handmade settlements, and changing terrain.","status":"Game Prototype","stack":["React","TypeScript","Vite","Three.js","Fastify","Supabase"],"impact":"Impact: combines procedural terrain, survival systems, and local-first persistence in an original browser world.","repoUrl":"https://github.com/jamesfontanilla/Rillforge","featured":false}'::jsonb),
  ('project', 'aralivo', 'Aralivo', 'published', false, '{"summary":"A private, free-first college learning workspace with study, practice, focus, planner, and learning-record workflows.","status":"Learning Workspace","stack":["React","TypeScript","Vite","FastAPI","Alembic","Supabase"],"impact":"Impact: keeps the learning loop usable without paywalls, billing, or external credentials.","repoUrl":"https://github.com/jamesfontanilla/Aralivo","featured":false}'::jsonb),
  ('project', 'portfolio-3d', 'Portfolio 3D', 'published', false, '{"summary":"A 3D portfolio experience that uses spatial interaction and immersive presentation to turn project browsing into a visual journey.","status":"Interactive Portfolio","stack":["Next.js","React","Three.js","React Three Fiber","Sanity"],"impact":"Impact: explores how spatial interfaces can make a portfolio feel like an experience rather than a catalogue.","featured":false}'::jsonb),
  ('project', 'routequilt', 'RouteQuilt', 'published', false, '{"summary":"A collaborative travel-planning workspace with seeded trips, protected workspaces, itinerary planning, sharing, and a synced 3D globe.","status":"Product MVP","stack":["Next.js","TypeScript","Prisma","PostgreSQL","Radix UI","Zod"],"impact":"Impact: gives trip collaborators a shared planning surface with a clear path from demo to production data.","repoUrl":"https://github.com/jamesfontanilla/RouteQuilt","featured":false}'::jsonb),
  ('certification', 'frontend-fundamentals', 'Frontend Fundamentals', 'published', false, '{"issuer":"Issuer Name","earnedOn":"2026-04-01","verificationUrl":"#"}'::jsonb),
  ('certification', 'ui-design-systems', 'UI Design Systems', 'published', false, '{"issuer":"Issuer Name","earnedOn":"2026-06-01","verificationUrl":"#"}'::jsonb),
  ('certification', 'cloud-basics', 'Cloud Basics', 'published', false, '{"issuer":"Issuer Name","earnedOn":"2026-07-01","verificationUrl":"#"}'::jsonb),
  ('event', 'hello-world-first-steps-ai-microsoft', 'Hello, World! Your First Steps into AI and Microsoft', 'published', true, '{"type":"Workshop","role":"Attendee","date":"2026-07-31","location":"Philippines / Online","summary":"An introductory session on getting started with AI and Microsoft technologies, designed to help learners take their first practical steps.","tags":["AI","Microsoft","Learning"]}'::jsonb),
  ('event', 'appbuildersph-meetup-shipaton-edition', 'AppBuildersPH Meetup: Shipaton Edition', 'published', false, '{"type":"Meetup","role":"Attendee","date":"2026-07-30","location":"Philippines / Online","summary":"A builder-focused meetup about turning ideas into shipped products through rapid prototyping, collaboration, and practical delivery lessons.","tags":["App Building","Community","Product"]}'::jsonb),
  ('event', 'awspeak-victory-fail-forward-fluently', 'AWSPEAK Victory: Fail Forward Fluently', 'published', false, '{"type":"Meetup","role":"Attendee","date":"2026-07-30","location":"Philippines / Online","summary":"A community session on learning from setbacks, iterating with confidence, and building stronger cloud projects through continuous improvement.","tags":["AWS","Cloud","Community"]}'::jsonb),
  ('event', 'seekers-guild-open-table-compass-conversation-vi', 'Seekers Guild Open Table: Compass and Conversation VI', 'published', false, '{"type":"Community Event","role":"Learner","date":"2026-07-26","location":"Philippines / Online","summary":"An open conversation space for exchanging perspectives, finding direction, and connecting with other curious members of the community.","tags":["Community","Conversation","Networking"]}'::jsonb),
  ('event', 'wordpress-manila-meetup-july-2026', 'WordPress Manila Meetup - July 2026', 'published', false, '{"type":"Meetup","role":"Attendee","date":"2026-07-25","location":"Manila","summary":"A WordPress community gathering covering practical web building, publishing, and the ideas shaping the local WordPress ecosystem.","tags":["WordPress","Web Development","Community"]}'::jsonb),
  ('event', 'build-nights-data-pipelines-analytics-dashboard-kiro', 'Build Nights: Data Pipelines & Analytics Dashboard with Kiro', 'published', false, '{"type":"Workshop","role":"Attendee","date":"2026-07-24","location":"Philippines / Online","summary":"A hands-on build night for connecting data pipelines to an analytics dashboard with Kiro and turning raw data into useful product insights.","tags":["Kiro","Data Engineering","Analytics"]}'::jsonb),
  ('event', 'awsug-ph-july-meetup-amazon-connect', 'AWSUG PH July Meetup: Amazon Connect', 'published', false, '{"type":"Meetup","role":"Attendee","date":"2026-07-23","location":"Philippines / Online","summary":"A user-group session exploring Amazon Connect and the cloud building blocks behind modern customer service experiences.","tags":["AWS","Amazon Connect","Cloud"]}'::jsonb),
  ('event', 'aws-buildercards-game-night', 'AWS BuilderCards Game Night', 'published', false, '{"type":"Game Night","role":"Participant","date":"2026-07-20","location":"Philippines / Online","summary":"A playful AWS learning session using BuilderCards to reinforce cloud concepts through collaboration, problem-solving, and friendly competition.","tags":["AWS","Learning","Community"]}'::jsonb),
  ('event', 'ai-pilipinas-meetup-33-claude-code-masterclass', 'AI Pilipinas Meetup #33: Claude Code Masterclass', 'published', false, '{"type":"Masterclass","role":"Attendee","date":"2026-07-18","location":"Philippines / Online","summary":"A practical masterclass on using Claude Code to work more effectively with AI-assisted software development and developer workflows.","tags":["AI","Claude Code","Developer Tools"]}'::jsonb),
  ('event', 'build-nights-full-stack-web-app-kiro', 'Build Nights: Full-Stack Web App with Kiro', 'published', false, '{"type":"Workshop","role":"Attendee","date":"2026-07-17","location":"Philippines / Online","summary":"A guided build session focused on creating a full-stack web application with Kiro, from interface to working application flow.","tags":["Kiro","Full Stack","Web Development"]}'::jsonb),
  ('event', 'aws-sbg-pup-serverless-data-pipeline', '[AWS SBG PUP] Building an End-to-End Serverless Data Pipeline with AWS', 'published', false, '{"type":"Workshop","role":"Attendee","date":"2026-07-13","location":"PUP, Manila","summary":"A practical AWS session on designing an end-to-end serverless data pipeline, connecting ingestion, processing, storage, and analytics.","tags":["AWS","Serverless","Data Engineering"]}'::jsonb),
  ('event', 'claude-code-manila-meetup-2', 'Claude Code Manila Meetup #2', 'published', false, '{"type":"Meetup","role":"Attendee","date":"2026-07-11","location":"Manila","summary":"A local developer meetup for sharing Claude Code workflows, experiments, and practical lessons from building with AI.","tags":["AI","Claude Code","Developer Community"]}'::jsonb),
  ('event', 'fusespark-ai-workflow-new-speed-building', '[FuseSpark] AI Workflow: The New Speed of Building', 'published', false, '{"type":"Workshop","role":"Attendee","date":"2026-07-11","location":"Philippines / Online","summary":"A session on how AI-assisted workflows are changing the pace of product development, from idea exploration to implementation.","tags":["AI","Workflow","Productivity"]}'::jsonb),
  ('event', 'build-nights-kiro-web-autonomous-agent', 'Build Nights: Kiro Web Autonomous Agent Workshop', 'published', false, '{"type":"Workshop","role":"Attendee","date":"2026-07-10","location":"Philippines / Online","summary":"A hands-on workshop exploring autonomous web agents with Kiro and the patterns behind AI-assisted web experiences.","tags":["Kiro","AI Agents","Web Development"]}'::jsonb),
  ('event', 'microsoft-azure-community-night-july-2026', 'Microsoft Azure Community Night - July Meetup', 'published', false, '{"type":"Meetup","role":"Attendee","date":"2026-07-10","location":"Philippines / Online","summary":"A Microsoft Azure community gathering for learning, sharing cloud practices, and connecting with fellow developers and cloud practitioners.","tags":["Microsoft Azure","Cloud","Community"]}'::jsonb),
  ('event', 'java-user-group-philippines-july-2026', 'Java User Group Philippines Meetup - July 2026', 'published', false, '{"type":"Meetup","role":"Attendee","date":"2026-07-09","location":"Philippines / Online","summary":"A Java community meetup for exchanging development practices, platform updates, and experiences from the Philippine Java ecosystem.","tags":["Java","Software Development","Community"]}'::jsonb),
  ('event', 'ph-cloud-educators-community-meetup-1', 'PH Cloud Educators Community Meetup #1', 'published', false, '{"type":"Meetup","role":"Attendee","date":"2026-07-04","location":"Philippines / Online","summary":"The first community meetup for cloud educators in the Philippines, focused on sharing teaching practices, cloud knowledge, and learning resources.","tags":["Cloud","Education","Community"]}'::jsonb),
  ('event', 'huawei-cloud-developer-group-kickoff', 'Huawei Cloud Developer Group – Kickoff Event', 'published', false, '{"type":"Community Event","role":"Attendee","date":"2026-06-30","location":"Philippines / Online","summary":"A kickoff gathering for developers interested in Huawei Cloud, introducing the community and creating space for future technical collaboration.","tags":["Huawei Cloud","Cloud","Developer Community"]}'::jsonb),
  ('event', 'tempest-ascend-to-the-cloud', 'Tempest: Ascend to the Cloud', 'published', false, '{"type":"Conference","role":"Attendee","date":"2026-06-30","location":"Philippines / Online","summary":"A cloud-focused event about modern infrastructure, platform growth, and the skills needed to move confidently into cloud development.","tags":["Cloud","Infrastructure","Learning"]}'::jsonb),
  ('event', 'aws-skill-builder-execution-workshop', 'AWS Skill Builder Execution Workshop', 'published', false, '{"type":"Workshop","role":"Learner","date":"2026-06-29","location":"Philippines / Online","summary":"A focused learning workshop for applying AWS Skill Builder lessons through structured practice and hands-on cloud execution.","tags":["AWS","Cloud Learning","Hands-On"]}'::jsonb),
  ('event', 'celestial-effervescence-serverless-apis', 'Celestial Effervescence: Serverless APIs with Lambda + API Gateway', 'published', false, '{"type":"Workshop","role":"Attendee","date":"2026-06-28","location":"Philippines / Online","summary":"A serverless development session on building and exposing APIs with AWS Lambda and API Gateway.","tags":["AWS","Serverless","APIs"]}'::jsonb),
  ('event', 'launching-private-alf-ec2-vpc', 'Launching Private Alf: Build & Deploy on EC2 with VPC', 'published', false, '{"type":"Workshop","role":"Attendee","date":"2026-06-27","location":"Philippines / Online","summary":"A practical deployment session covering how to build and run an application on EC2 within a VPC-based AWS network.","tags":["AWS","EC2","VPC"]}'::jsonb),
  ('event', 'microsoft-build-localhost-manila', 'Microsoft Build //localhost: Manila', 'published', false, '{"type":"Community Event","role":"Attendee","date":"2026-06-26","location":"Manila","summary":"A local Microsoft Build gathering bringing developers together to explore announcements, tools, and practical opportunities across the Microsoft platform.","tags":["Microsoft","Developer Community","AI"]}'::jsonb),
  ('event', 'light-up-ai-workato-enterprise-mcp', 'Light up Your AI With Workato Enterprise MCP', 'published', false, '{"type":"Workshop","role":"Attendee","date":"2026-06-23","location":"Philippines / Online","summary":"A session on connecting AI workflows with enterprise systems through Workato and the Model Context Protocol.","tags":["AI","MCP","Automation"]}'::jsonb),
  ('event', 'data-engineering-pilipinas-year-3-meetup', 'Data Engineering Pilipinas Year 3 Meetup', 'published', false, '{"type":"Meetup","role":"Attendee","date":"2026-06-21","location":"Philippines / Online","summary":"A milestone meetup celebrating three years of the Data Engineering Pilipinas community and sharing practical data engineering knowledge.","tags":["Data Engineering","Community","Philippines"]}'::jsonb),
  ('event', 'cafe-cursor-manila', 'Cafe Cursor Manila', 'published', false, '{"type":"Meetup","role":"Attendee","date":"2026-06-16","location":"Manila","summary":"A casual developer gathering for conversations, co-learning, and exchanging ideas around AI-assisted coding and modern development tools.","tags":["AI","Developer Tools","Community"]}'::jsonb),
  ('event', 'git-it-done-version-control-basics', 'Git It Done: Version Control Basics', 'published', false, '{"type":"Workshop","role":"Learner","date":"2026-06-14","location":"Philippines / Online","summary":"A beginner-friendly workshop covering the core concepts and everyday workflows of Git and version control.","tags":["Git","Version Control","Learning"]}'::jsonb),
  ('event', 'fifa-afc-agentic-football-cup', 'FIFA × AFC: Agentic Football Cup', 'published', false, '{"type":"Competition","role":"Participant","date":"2026-06-12","location":"Philippines / Online","summary":"A creative AI competition exploring agentic systems through a football-themed challenge and collaborative building.","tags":["AI Agents","Competition","Innovation"]}'::jsonb),
  ('event', 'gdg-build-with-ai-future-ai-research', 'GDG Build with AI: The Future of AI and Research', 'published', false, '{"type":"Community Event","role":"Attendee","date":"2026-06-06","location":"Philippines / Online","summary":"A Google Developer Groups event examining the future of AI, current research directions, and how developers can build with emerging tools.","tags":["AI","Research","Google Developer Groups"]}'::jsonb),
  ('event', 'aws-sbg-pup-pytorch-community-launch-ai-meetup', 'AWS SBG PUP × PyTorch Philippines: Community Launch and AI Meetup', 'published', false, '{"type":"Community Launch","role":"Attendee","date":"2026-06-05","location":"PUP, Manila","summary":"A community launch and AI meetup bringing AWS, PyTorch, and local developer communities together for learning and collaboration.","tags":["AI","AWS","PyTorch"]}'::jsonb),
  ('event', 'microsoft-fabric-foundry-workshop', 'Microsoft Fabric + Foundry Workshop', 'published', false, '{"type":"Workshop","role":"Attendee","date":"2026-06-03","location":"Philippines / Online","summary":"A hands-on workshop exploring Microsoft Fabric and Azure AI Foundry for building data and AI solutions on the Microsoft cloud.","tags":["Microsoft Fabric","Azure AI Foundry","Data"]}'::jsonb),
  ('blog', 'building-os-portfolio', 'Building an OS-style portfolio with Next.js', 'published', true, '{"slug":"building-os-portfolio","excerpt":"How I built a browser-based desktop OS experience using React, CSS glassmorphism, and the Web Animations API.","tags":["Next.js","React","CSS"],"publishedAt":"2026-07-10","featured":true}'::jsonb)
on conflict (kind, slug) do update set
  title = excluded.title,
  status = excluded.status,
  featured = excluded.featured,
  data = excluded.data;

update public.content_entries
set data = data || jsonb_build_object(
  'summary', 'QCU2 — Beta represented Quezon City University and the Philippines at the 2026 VEX Robotics World Championship, finishing 29th in Research Division qualifications and 50th in World Robot Skills.',
  'body', $body$
# 🌎 VEX Robotics World Championship 2026

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
[2]: https://recf.org/documents/2026/04/research-division-list-vurc-2026-vex-robotics-world-championship.pdf/?utm_source=chatgpt.com "Team List — 2026 VEX Robotics World Championship"
  $body$
)
where kind = 'competition'
  and slug = 'vex-robotics-world-championship-qcu2';

insert into public.content_entries (kind, slug, title, status, featured, data)
values (
  'competition',
  'vex-robotics-philippine-national-championship-2026',
  'VEX Robotics Philippine National Championship 2026',
  'published',
  false,
  $data$
  {
    "summary": "QCU2 earned the Design Award, Robot Skills — 2nd Place, and Tournament Finalist honors at the 2026 Philippine National Championship.",
    "status": "National Robotics",
    "tags": ["Robotics", "Engineering Documentation", "Robot Skills", "VEX", "QCU2"],
    "body": "# 🇵🇭 VEX Robotics Philippine National Championship 2026\n\n**January 29-30, 2026**\n\nOn January 29-30, 2026, **QCU2** competed at the **VEX Robotics Philippine National Championship**, putting months of engineering, iteration, documentation, and teamwork to the test.\n\nWhat started as a robotics project became an opportunity to compete alongside some of the strongest teams in the country—and ultimately produced three major results:\n\n* 🏆 **Design Award**\n* 🥈 **Robot Skills — 2nd Place**\n* 🥈 **Tournament Finalists**\n\n## 🏆 Design Award\n\nOne of our biggest achievements was receiving the **Design Award**, a judged recognition centered on the team's engineering design process.\n\nThe award isn't simply about having an impressive robot. VEX places significant emphasis on how teams **design, document, iterate, innovate, and explain the decisions behind their robot**. Teams are expected to demonstrate ownership of their engineering process and be able to defend their design decisions.\n\nFor QCU2, this meant documenting how our robot evolved, why particular design decisions were made, and how testing and iteration shaped the final system.\n\nReceiving the Design Award was therefore a recognition not only of the robot we built, but of the **engineering process behind it**.\n\n## 🥈 Robot Skills — 2nd Place\n\nWe also finished **2nd Place in Robot Skills**.\n\nRobot Skills combines **Driving Skills** and **Autonomous Coding Skills**, with teams ranked according to their combined performance.\n\nFinishing second nationally demonstrated our ability to translate the robot's engineering design into competitive performance under the pressure of the championship.\n\n## 🥈 Tournament Finalists\n\nOur run also took us all the way to the **Tournament Finals**, where QCU2 competed for the championship.\n\nReaching the finals was a different kind of validation from Robot Skills. It showed that our robot and team could perform not only in individual skills runs, but also in the head-to-head tournament environment.\n\nWe ultimately finished as **Tournament Finalists**—just short of the championship, but proud of how far the team had progressed.\n\n---\n\n## More Than Three Awards\n\nLooking back, the results were more than a collection of trophies.\n\n**Design Award**\n→ Our engineering process and documentation mattered.\n\n**Robot Skills 2nd Place**\n→ Our robot could perform at a high competitive level.\n\n**Tournament Finalists**\n→ We could compete deep into the championship tournament.\n\nTogether, these results represented three different dimensions of the same thing:\n\n> **Engineering something, understanding why you built it, and making it perform when it matters.**\n\nFor me personally, this championship became one of the experiences that showed how quickly engineering can move from something learned in the classroom to something tested in a real competitive environment.\n\nAnd this was only the beginning of my VEX journey.\n\n**QCU2 → Philippine National Championship → VEX Robotics World Championship 🇵🇭🌎**",
    "photos": [],
    "featured": false
  }
  $data$::jsonb
)
on conflict (kind, slug) do update set
  title = excluded.title,
  status = excluded.status,
  featured = excluded.featured,
  data = excluded.data;
