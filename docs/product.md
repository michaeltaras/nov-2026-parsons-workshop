# Product brief

## Mission and audience
Help politically curious New Yorkers understand election results, geographic voting patterns, and the limits of election maps. Visitors may enjoy news graphics without knowing what a percentage-point margin means. We are a fictional independent newsroom; we do not advocate for a candidate or party.

## Core problems
- Understand which candidate led and how many votes each received.
- Discover variation across counties without confusing geographic area with voting power.
- Find close county results and relate a selected county to the state.
- Understand when a dataset is incomplete and what comparisons it supports.

## Principles
Accuracy takes precedence over a compelling headline. Show source status and year next to results. Never present missing votes as zeros. Offer an accessible alternative to pointing at small geographic shapes. Keep a coherent editorial voice. Use shared calculations, colors, and labels so the same statistic means the same thing everywhere.

## First-release scope
The 2026 governor explorer displays 62 authentic county boundaries, selection, optional county labels, a county picker, candidate votes, closest reported county margins, and county/state share bars. All result views use one dated unofficial snapshot. Data came from the BOE via New York Focus’s public feed; every party line, ballot category, and district count reconciles exactly with the independent statewide BOE snapshot.

Success: a first-time visitor can discover a meaningful county/state difference within five minutes; can explain what the color represents; can identify the year/status; and can find the source. In a workshop, ask participants to demonstrate those outcomes rather than assume a beautiful map succeeds.

## Current limitations and tradeoffs
The snapshot is unofficial and incomplete. District reporting is not vote completion or certification: Westchester has positive votes with 0/906 districts reporting, alongside the BOE’s warning about unscanned emergency ballots. Both facts are preserved visibly. All counties have counts, but that does not make the totals final. There is no live refresh or historical swing calculation. Archived 2022 data is retained for carefully scoped future comparisons; it is not shown in the current explorer.

The main map is area weighted, not population weighted. The share comparison explains this but does not solve geographic visual dominance. Color uses teal/rust to avoid a conventional campaign aesthetic; beginner issues can reconsider perceptual balance. County labels overlap at small scales. The dropdown is an essential alternative for tiny NYC counties. Keyboard focus reaches every county, which is accessible but laborious. No custom search, map zoom, saved links, multiple contests, or historical comparison exists yet. The default county is New York County, an editorial choice open to debate.

## Open product questions
How prominently should the landing view explain incomplete district reporting? What evidence is sufficient to publish a new snapshot? Does the phrase “closest counties” imply a county is itself a separate gubernatorial contest? Would vote counts, a dot map, or a cartogram tell a more useful story? What should a visitor learn from hovering versus selecting? How should a mobile visitor move between the map and selected details? Discuss purpose and tradeoffs before implementing.
