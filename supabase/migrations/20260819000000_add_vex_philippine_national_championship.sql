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
