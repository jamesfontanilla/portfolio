update public.content_entries
set data = data || jsonb_build_object(
  'summary', 'QCU2 — Beta represented Quezon City University and the Philippines at the 2026 VEX Robotics World Championship, finishing 29th in Research Division qualifications and 50th in World Robot Skills.',
  'body', $body$
# 🌎 VEX Robotics World Championship 2026

**April 25–27, 2026 — St. Louis, Missouri, USA**

On April 22, I left the Philippines with the **Quezon City University Robotics Team** for an opportunity I never expected to experience during my freshman year: competing at the **2026 VEX Robotics World Championship** in St. Louis, Missouri.

From April 25–27, **QCU2 – Beta** competed alongside university teams from around the world, representing both **Quezon City University and the Philippines** on an international stage. QCU's official results placed QCU2 **50th out of 84 teams in the World Skills Challenge**, while the team finished **29th out of 40 teams in its Research Division qualification ranking**. ([Quezon City University][1])

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
🤖 50th / 84 — World Robot Skills Challenge

**From simply showing up to competing on the world stage.**

[1]: https://qcu.edu.ph/qcu-robotics-team-earns-global-ranking-at-the-2026-vex-robotics-world-championship/?utm_source=chatgpt.com "Quezon City University — QCU Robotics Team Earns Global Ranking"
[2]: https://recf.org/documents/2026/04/research-division-list-vurc-2026-vex-robotics-world-championship.pdf/?utm_source=chatgpt.com "Team List — 2026 VEX Robotics World Championship"
  $body$
)
where kind = 'competition'
  and slug = 'vex-robotics-world-championship-qcu2';
