update public.content_entries
set data = data || jsonb_build_object(
  'body',
  replace(
    replace(
      data->>'body',
      $old$From April 25–27, **QCU2 – Beta** competed alongside university teams from around the world, representing both **Quezon City University and the Philippines** on an international stage. QCU's official results placed QCU2 **50th out of 84 teams in the World Skills Challenge**, while the team finished **29th out of 40 teams in its Research Division qualification ranking**. ([Quezon City University][1])$old$,
      $new$From April 25–27, **QCU2 – Beta** competed alongside university teams from around the world, representing both **Quezon City University and the Philippines** on an international stage. QCU's official results placed QCU2 **50th out of 84 teams in the World Skills Challenge**, while the team finished **29th out of 40 teams in its Research Division qualification ranking**. ([Quezon City University][1])

Across the full **2025–2026 season**, QCU2 also achieved a **78th out of 266 global VEX U ranking**, reflecting the team's performance across the entire season beyond the World Championship event.$new$
    ),
    $old2$🌎 Represented the Philippines
🎯 29th / 40 — Research Division Qualifications
🤖 50th / 84 — World Robot Skills Challenge$old2$,
    $new2$🌎 Represented the Philippines
🎯 29th / 40 — Research Division Qualifications
🌍 78th / 266 — Global VEX U Ranking (2025–2026 season)
🤖 50th / 84 — World Robot Skills Challenge$new2$
  )
)
where kind = 'competition'
  and slug = 'vex-robotics-world-championship-qcu2';
