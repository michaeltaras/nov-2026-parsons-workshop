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
The complete certified 2022 governor county explorer is the default, with 62 authentic county boundaries, selection, optional county labels, a county picker, vote details, closest-county ranking, and county/state share bars. A distinct 2026 view provides the acquired unofficial statewide snapshot. It deliberately removes the historical map when 2026 is selected.

Success: a first-time visitor can discover a meaningful county/state difference within five minutes; can explain what the color represents; can identify the year/status; and can find the source. In a workshop, ask participants to demonstrate those outcomes rather than assume a beautiful map succeeds.

## Current limitations and tradeoffs
The requested 2026 county dataset was not acquired, so the release is explicit about using a historical county explorer. The default has a conspicuous 2022 notice, not a misleading 2026 map. No historical swing is calculated from a partial statewide snapshot. This data limitation is separate from the intentional feature backlog.

The main map is area weighted, not population weighted. The share comparison explains this but does not solve geographic visual dominance. Color uses teal/rust to avoid a conventional campaign aesthetic; beginner issues can reconsider perceptual balance. County labels overlap at small scales. The dropdown is an essential alternative for tiny NYC counties. Keyboard focus reaches every county, which is accessible but laborious. No custom search, map zoom, saved links, multiple contests, or historical comparison exists yet. The default county is New York County, an editorial choice open to debate.

## Open product questions
Should the landing view prioritize current incomplete totals or complete historical exploration? What evidence is sufficient to publish a new snapshot? Does the phrase “closest counties” imply a county is itself a separate gubernatorial contest? Would vote counts, a dot map, or a cartogram tell a more useful story? What should a visitor learn from hovering versus selecting? How should a mobile visitor move between the map and selected details? Discuss purpose and tradeoffs before implementing.
