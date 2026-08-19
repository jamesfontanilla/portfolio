insert into public.content_entries (kind, slug, title, status, featured, data)
values (
  'competition',
  'sparkfest-2026-orderly-ops-chronisync',
  'SparkFest 2026 — Orderly Ops',
  'published',
  false,
  $data$
  {
    "summary": "Team Orderly Ops reached the Top 10 Finalists at SparkFest 2026 with ChroniSync, an AI-assisted chronic disease monitoring platform.",
    "status": "Hackathon Finalist",
    "tags": ["Hackathon", "Healthcare AI", "Gemini", "Firebase", "Community Impact", "Orderly Ops"],
    "body": "# ⚡ SparkFest 2026\n\n**June 28–July 9, 2026 — Bulwagang Bonifacio, PUP Manila**\n\nSparkFest 2026 was the flagship hackathon of **Google Developer Groups on Campus PUP**, bringing students from technical, creative, and managerial backgrounds together to build solutions for real-world and community challenges.\n\n## 🩺 Our project: ChroniSync\n\nWith **Team Orderly Ops**, we built **ChroniSync**, an AI-assisted chronic disease monitoring platform connecting patients, caregivers, and physicians.\n\nChroniSync supports four chronic conditions:\n\n* Type 2 diabetes\n* Hypertension\n* Chronic kidney disease\n* Chronic obstructive pulmonary disease (COPD)\n\nPatients can log vitals, medications, symptoms, and daily check-ins. The platform then contextualizes that information against disease-specific clinical guidelines and produces AI-assisted summaries, trend explanations, and rule-based alerts.\n\nThe system was designed as a transparent, clinician-reviewable coordination layer—not as a diagnosis engine.\n\n## 🏅 Top 10 Finalists\n\nTeam Orderly Ops was named one of the **Top 10 Finalists** of SparkFest 2026 with ChroniSync.\n\nReaching the finalist stage validated more than the prototype itself. It recognized the team's ability to connect a meaningful healthcare problem with a practical, guideline-grounded technology solution.\n\n## 🧠 Google technologies\n\nChroniSync used Google technologies across its application stack:\n\n* **Gemini API** for AI-assisted document extraction and visit and trend summarization\n* **Firebase Authentication** for sign-in, registration, password reset, and role-based routing\n* **Cloud Firestore** for clinical and portal data\n* **Firebase Storage** for patient documents and files\n* **Firebase Admin SDK** for secure server-side access\n\n## 🌱 From prototype to impact\n\nSparkFest was built around a simple idea: technology should move beyond a demo and create value for a real community.\n\nChroniSync became our response to that challenge—a platform focused on helping people manage ongoing health conditions while giving caregivers and physicians a clearer view of the patient's journey.\n\nFor me, the hackathon was an opportunity to practice engineering in a team, build with Google technologies, and turn a healthcare concept into a working product under a real deadline.\n\n**Orderly Ops → ChroniSync → SparkFest 2026 Top 10 Finalists**\n\n[1]: https://sparkfest.gdgpup.org/ \"SparkFest 2026 — GDG on Campus PUP\"\n[2]: https://github.com/jamesfontanilla/chronisync \"ChroniSync on GitHub\"",
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
