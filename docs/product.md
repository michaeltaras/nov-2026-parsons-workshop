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

The 2026 governor explorer displays 62 authentic county boundaries, selection, optional county labels, a county picker, candidate votes, closest reported county margins, and county/state share bars. Current-result views use one dated unofficial snapshot. Three linked editorial questions organize the experience: how geography differs from vote weight, how county net votes add up to the state, and how the incomplete 2026 results compare with certified 2022. Data came from the BOE via New York Focus’s public feed; every party line, ballot category, and district count reconciles exactly with the independent statewide BOE snapshot.

Success: a first-time visitor can discover a meaningful county/state difference within five minutes; can explain what the color represents; can identify the year/status; and can find the source. In a workshop, ask participants to demonstrate those outcomes rather than assume a beautiful map succeeds.

## Current limitations and tradeoffs

The snapshot is unofficial and incomplete. District reporting is not vote completion or certification: Westchester has positive votes with 0/906 districts reporting, alongside the BOE’s warning about unscanned emergency ballots. Both facts are preserved visibly. All counties have counts, but that does not make the totals final. There is no live refresh. The historical section explicitly contrasts certified 2022 with incomplete 2026, uses a same-office baseline, and separates share-margin change from net-vote change and counted candidate-vote volume. It does not infer individual switching, causation, a final participation change, or a turnout rate.

The main map can switch between land-area shapes and circles whose areas represent reported candidate votes. Circles are displaced with guide lines to remain distinct; this trades exact position for comparable area. The original map and county dropdown preserve geographic context. The publication layout uses a white background, black serif headings, sans-serif chart labels, fine rules, and blue/red for Democratic/Republican data. Interface controls and selection markers use neutral colors. County labels overlap at small scales. The dropdown is an essential alternative for tiny NYC counties. Keyboard focus reaches every county, which is accessible but laborious. No custom search, map zoom, saved links, or multiple-contest selection exists yet. The default county is New York County, an editorial choice open to debate.

## Open product questions

How prominently should the landing view explain incomplete district reporting? What evidence is sufficient to publish a new snapshot? Does the phrase “closest counties” imply a county is itself a separate gubernatorial contest? Does the land-to-vote-circle switch actually help readers understand geographic visual dominance? Do the largest margin changes or the largest net-vote changes tell the more useful historical story? What should a visitor learn from hovering versus selecting? How should a mobile visitor move between the map and selected details? Discuss purpose and tradeoffs before implementing.

## Visual and editorial style

Use direct, descriptive titles: “New York Governor Election Results,” “County results,” and “Change since the 2022 governor election.” Explain units, sources, dates, and limits in plain language. Avoid slogans, rhetorical chart headlines, italic promotional phrases, decorative icons, numbered chapter labels, and claims about curiosity or shared understanding. The visual reference is a newspaper election feature: strong serif headline, compact metadata, aligned numbers, thin rules, and a white page. Keep explanatory text where it clarifies a statistic. Avoid tinted cards, gradients, shadows, and ornamental badges. Use the shared palette for data only; preserve its ordering and thresholds. Fonts are system serif/sans-serif stacks so the app stays independent of external font requests.
