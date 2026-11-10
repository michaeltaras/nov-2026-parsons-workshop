# Workshop issue backlog

Choose a user outcome, claim it, and coordinate with peers before changing shared files. These are discussion starters, not prescriptions. Acceptance criteria describe evidence; where a product decision is open, agree on the interpretation in the issue. No intentional regressions are planted.

## Beginner

### 01. Explain the margin in everyday language

**Difficulty:** Beginner

**Problem and why it matters:** Readers may read D +6 as six percent of all ballots or six extra votes. Help them interpret a percentage-point lead.

**Acceptance / discussion:** Add a concise explanation near the legend and spotlight; use a real county example; ask a peer to explain it back.

**Relevant areas:** src/components/Legend.tsx; src/features/CountyDetails.tsx

**Potential interactions:** Shared labels, map caption, and rounding choices.

### 02. Give the map legend a stronger visual hierarchy

**Difficulty:** Beginner

**Problem and why it matters:** The color key is compact on a projector. Decide which labels viewers need to read first.

**Acceptance / discussion:** Check a projected or zoomed-out view and mobile; preserve the actual thresholds; retain an understandable zero point.

**Relevant areas:** src/components/Legend.tsx; src/styles/global.css

**Potential interactions:** Map colors and supporting chart colors.

### 03. Make county hover feedback easier to notice

**Difficulty:** Beginner

**Problem and why it matters:** Visitors may not discover that counties are interactive. Improve the feedback without obscuring nearby shapes.

**Acceptance / discussion:** Pointer and keyboard focus both reveal the county and margin; the selected county stays recognizable after hover ends.

**Relevant areas:** src/features/ElectionMap.tsx; src/styles/global.css

**Potential interactions:** Selected styling, optional labels, and future tooltip work.

### 04. Make large vote totals easier to scan

**Difficulty:** Beginner

**Problem and why it matters:** The statewide results have several kinds of numbers. Explore alignment and number typography to make comparisons easier.

**Acceptance / discussion:** Use consistent number formatting; preserve full totals somewhere visible; verify the statewide and county views and narrow screens.

**Relevant areas:** src/features/StatewideResults.tsx; src/utils/formatNumbers.ts; src/styles/global.css

**Potential interactions:** All consumers of shared formatters.

### 05. Improve the small-screen county handoff

**Difficulty:** Beginner

**Problem and why it matters:** After tapping a county, mobile visitors may not realize details changed farther down the page. Decide how to signal the change.

**Acceptance / discussion:** Demonstrate a clear response to selection on mobile; preserve keyboard focus; avoid a disruptive jump on desktop; add or update a browser assertion.

**Relevant areas:** src/App.tsx; src/features/CountyDetails.tsx; src/styles/global.css; tests/e2e

**Potential interactions:** Shared selection and mobile chart layout.

### 06. Make the default county an editorial decision

**Difficulty:** Beginner

**Problem and why it matters:** The initial New York County spotlight is a choice, not a neutral overview. Discuss what first-time readers should see.

**Acceptance / discussion:** Document the chosen starting behavior and reason; verify selection remains coherent across map, picker, and comparison; adjust tests only where behavior changes.

**Relevant areas:** src/App.tsx; docs/product.md; tests/integration

**Potential interactions:** Future shareable URLs and state-level onboarding.

### 07. Clarify that a close county is not a separate governor race

**Difficulty:** Beginner

**Problem and why it matters:** The county ranking can be mistaken for a list of independently decided elections. Improve the headline and supporting explanation.

**Acceptance / discussion:** A reader understands this ranks geographic margins within one statewide contest; preserve ordering and selection.

**Relevant areas:** src/features/Comparisons.tsx

**Potential interactions:** Margin definitions and candidate labels.

### 08. Show the source date near each overview

**Difficulty:** Beginner

**Problem and why it matters:** The methodology is distant from the numbers. Help readers identify the current fixed snapshot and its unofficial status.

**Acceptance / discussion:** Statewide and county views show status and appropriate date; no timestamp implies live updates; source links remain discoverable.

**Relevant areas:** src/features/StatewideResults.tsx; src/App.tsx; data/sources.md

**Potential interactions:** Source metadata and snapshot conventions.

### 09. Improve the county picker for touch and keyboard

**Difficulty:** Beginner

**Problem and why it matters:** The dropdown is the best route to tiny NYC counties. Make its role and interaction easier to discover.

**Acceptance / discussion:** Label and focus are clear, touch target is comfortable, selected option matches the map; test keyboard and mobile.

**Relevant areas:** src/App.tsx; src/styles/global.css

**Potential interactions:** Future search controls and shared selection.

### 10. Bring write-ins into the visual explanation

**Difficulty:** Beginner

**Problem and why it matters:** Write-ins are included in shares but nearly invisible in the statewide strip. Decide how much prominence they need.

**Acceptance / discussion:** Provide a clear label or accessible description; retain the correct denominator and total; avoid exaggerating the area of the write-in segment.

**Relevant areas:** src/features/StatewideResults.tsx; src/features/Comparisons.tsx

**Potential interactions:** Candidate comparison colors and percent formatting.

## Intermediate

### 11. Add a county search that works beyond exact names

**Difficulty:** Intermediate

**Problem and why it matters:** Visitors know the county they want but may not know where it is. Offer a discoverable way to find it.

**Acceptance / discussion:** Discuss aliases such as Brooklyn and Manhattan; handle no matches; selection updates all linked views; include interaction tests.

**Relevant areas:** src/App.tsx; src/data/elections.ts; tests/integration

**Potential interactions:** County picker, selection, and geographic naming.

### 12. Revisit the map palette for perceptual balance

**Difficulty:** Intermediate

**Problem and why it matters:** Strong teal and rust fills may not appear equally prominent. Investigate whether the scale supports fair interpretation.

**Acceptance / discussion:** Explain palette choices with contrast and color-vision checks; update map, charts, and legend together; add threshold or rendering tests if the contract changes.

**Relevant areas:** src/utils/electionColors.ts; src/components/Legend.tsx; src/styles/global.css

**Potential interactions:** Every visualization using candidate colors or margin colors.

### 13. Compare full county margin rankings

**Difficulty:** Intermediate

**Problem and why it matters:** The six closest counties tell only one story. Let readers inspect the whole ranking and choose a useful ordering.

**Acceptance / discussion:** Discuss signed versus absolute margin sorting; retain selection; use the same denominator and missing-data rules; add a sorting test.

**Relevant areas:** src/features/Comparisons.tsx; src/data/elections.ts

**Potential interactions:** Close-county editorial copy and future filtering.

### 14. Design a shared tooltip with a real second use

**Difficulty:** Intermediate

**Problem and why it matters:** The map readout is useful but charts lack equivalent inspection. Decide what information belongs in a reusable tooltip.

**Acceptance / discussion:** Use it in at least two meaningful contexts; support focus and touch; keep tooltip content readable and not hover-only; test dismissal or selection behavior.

**Relevant areas:** src/features/ElectionMap.tsx; src/features/Comparisons.tsx; src/components

**Potential interactions:** Selection, labels, and accessibility.

### 15. Add an explicit missing-results presentation

**Difficulty:** Intermediate

**Problem and why it matters:** Current county data is complete, but a future source may be partial. Readers need to understand missing values without mistaking them for ties.

**Acceptance / discussion:** Use clearly synthetic test fixtures only; missing, zero-vote, and tied cases are distinct in legend/details/charts; do not modify real source data; add tests.

**Relevant areas:** src/data/elections.ts; src/components/Legend.tsx; src/features/CountyDetails.tsx; tests/unit

**Potential interactions:** Data contracts and future 2026 county import.

### 16. Reveal New York’s fusion ballot lines

**Difficulty:** Intermediate

**Problem and why it matters:** Some readers do not understand why multiple parties support one candidate. Let them inspect ballot-line totals.

**Acceptance / discussion:** Candidate totals remain the sum of their lines; avoid double counting; include a brief explanation and a test with multiple lines.

**Relevant areas:** src/features/CountyDetails.tsx; src/data/elections.ts

**Potential interactions:** Shared candidate aggregation, overview, and future contest metadata.

### 17. Offer a vote-count comparison alongside shares

**Difficulty:** Intermediate

**Problem and why it matters:** Equal-length share bars hide enormous differences in county vote totals. Explore a count-based comparison.

**Acceptance / discussion:** Discuss the question answered by absolute counts; label units and scale; retain write-ins and status; verify selected county/state reconciliation.

**Relevant areas:** src/features/Comparisons.tsx; src/utils/formatNumbers.ts

**Potential interactions:** Existing comparison layout, color semantics, and mobile sizing.

### 18. Make the map easier to explore without a pointer

**Difficulty:** Intermediate

**Problem and why it matters:** Tabbing through 62 counties is tedious. Explore a better keyboard interaction while preserving the dropdown alternative.

**Acceptance / discussion:** Discuss predictable navigation order; make focus visible; document controls; ensure selection updates details; add keyboard tests.

**Relevant areas:** src/features/ElectionMap.tsx; src/App.tsx; tests/integration

**Potential interactions:** Tooltip focus management and future zoom.

### 19. Keep county labels legible at small scales

**Difficulty:** Intermediate

**Problem and why it matters:** Turning on labels creates overlap, especially near New York City. Decide which geographic labels deserve priority.

**Acceptance / discussion:** Explain the labeling strategy; no label blocks county interaction; test mobile and a dense region; offer access to omitted names.

**Relevant areas:** src/features/ElectionMap.tsx; src/styles/global.css

**Potential interactions:** Hover feedback, tooltips, and projection.

### 20. Show the distribution of county margins

**Difficulty:** Intermediate

**Problem and why it matters:** A map does not show whether most counties were close or lopsided. Add a distribution chart with a clear statistical unit.

**Acceptance / discussion:** Explain that each county counts once, not each voter; make bins or dots understandable; selection links to the rest of the app; test bin totals if used.

**Relevant areas:** src/features/Comparisons.tsx; src/data/elections.ts

**Potential interactions:** Shared margins, colors, chart layout, and filters.

## Advanced

### 21. Refresh and audit the 2026 county snapshot

**Difficulty:** Advanced

**Problem and why it matters:** The current county snapshot reconciles, but it is still unofficial and dated. Establish a reliable process for acquiring and reviewing a newer snapshot.

**Acceptance / discussion:** Preserve both old and new raw evidence, timestamps, reporting status and fusion lines; reconcile all county sums against the same statewide snapshot and an independent official source; explain discrepancies rather than patching counts; keep tests and source docs current.

**Relevant areas:** scripts/prepare-data.py; data; src/data/elections.ts; src/App.tsx

**Potential interactions:** All result views, missing-data treatment, and state totals.

### 22. Explain what drove the change in net votes

**Difficulty:** Advanced

**Problem and why it matters:** The historical view separates share-margin, net-vote, and candidate-vote-volume changes. Readers still cannot see how changes in vote shares and vote volume combine arithmetically to change net votes.

**Acceptance / discussion:** Discuss a clearly defined arithmetic decomposition; distinguish an accounting identity from a causal explanation; preserve certified-versus-incomplete labels and write-in denominators; explain choices of baseline; add tests that reconcile the decomposition.

**Relevant areas:** data; scripts/prepare-data.py; src/data/elections.ts; src/features

**Potential interactions:** 2026 county import, color semantics, and missing results.

### 23. Give New York City an honest close-up

**Difficulty:** Advanced

**Problem and why it matters:** Five tiny counties contain many voters but are difficult to see. Explore an inset or a zoom interaction.

**Acceptance / discussion:** Preserve authentic shapes and consistent coloring; clearly label any inset scale; selection works in both locations; support touch and keyboard; verify mobile.

**Relevant areas:** src/features/ElectionMap.tsx; src/styles/global.css; tests/e2e

**Potential interactions:** Labels, projection, hover, and keyboard movement.

### 24. Evaluate alternatives to displaced vote circles

**Difficulty:** Advanced

**Problem and why it matters:** The vote-circle mode sizes area by reported candidate votes and displaces circles to avoid overlap. Evaluate whether another representation better balances geography, comparisons, and interaction.

**Acceptance / discussion:** Compare the existing circles with dots, a cartogram, or another well-argued alternative; test the question it answers with peers; document the metric and geographic distortion; retain linked selection and proportional-size tests where appropriate.

**Relevant areas:** src/features/ElectionMap.tsx; src/data/elections.ts; src/utils/electionColors.ts

**Potential interactions:** Map legend, selected state, accessibility, and chart explanations.

### 25. Add another statewide contest with an explicit data contract

**Difficulty:** Advanced

**Problem and why it matters:** One race limits exploration. Research another real contest and decide what can be safely shared.

**Acceptance / discussion:** Keep sourced raw and normalized data; define candidate identities and party lines per contest; labels and denominators change together; preserve county selection; add race-switch tests.

**Relevant areas:** src/data/elections.ts; src/App.tsx; src/features; data

**Potential interactions:** Hardcoded candidate identities, current year behavior, and all result views.

### 26. Make a county exploration shareable by URL

**Difficulty:** Advanced

**Problem and why it matters:** A visitor cannot currently send a link to a selected county. Add a simple, inspectable navigation contract.

**Acceptance / discussion:** Document query/hash format; handle invalid or unavailable county/year values; support back/forward; preserve page-anchor navigation; test reload and history.

**Relevant areas:** src/App.tsx; tests/e2e; docs/architecture.md

**Potential interactions:** Default selection, year control, and keyboard focus.

### 27. Create a filter that tells a useful editorial story

**Difficulty:** Advanced

**Problem and why it matters:** Readers may want to focus on close counties or another meaningful subset. Decide what question a filter should answer.

**Acceptance / discussion:** Discuss whether charts show filtered or statewide values; label the scope explicitly; keep statewide totals factual; preserve or explain hidden selection; add cross-view tests.

**Relevant areas:** src/App.tsx; src/features/ElectionMap.tsx; src/features/Comparisons.tsx

**Potential interactions:** Ranking, shared selection, missing states, and statistical denominators.

### 28. Evaluate the five-minute discovery experience

**Difficulty:** Advanced

**Problem and why it matters:** The product claims a newcomer can discover something meaningful quickly. Test that claim and implement a focused response.

**Acceptance / discussion:** Observe at least two peers without giving instructions; record confusion about year, source, or metric; choose one substantiated change; preserve data accuracy; document evidence and verify affected views.

**Relevant areas:** docs/product.md; src/App.tsx; relevant feature and tests

**Potential interactions:** Potentially onboarding, default year/county, labels, and navigation.
