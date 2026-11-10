import { useState } from "react";
import { counties, statewide2026 } from "./data/elections";
import ElectionMap from "./features/ElectionMap";
import CountyDetails from "./features/CountyDetails";
import StatewideResults from "./features/StatewideResults";
import Comparisons from "./features/Comparisons";
import MarginContributions from "./features/MarginContributions";
import HistoricalChanges from "./features/HistoricalChanges";
export default function App() {
  const [selected, setSelected] = useState("36061");
  const county = counties.find((item) => item.fips === selected)!;
  return (
    <>
      <a className="skip-link" href="#explore">
        Skip to results
      </a>
      <header className="masthead">
        <a href="#" className="brand">
          <span className="brand-symbol">✳</span> THE ELECTION ATLAS
          <span className="brand-year">2026</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#explore">Explore the results</a>
          <a href="#methodology">
            Data & methodology <span>↗</span>
          </a>
        </nav>
        <span className="edition">NEW YORK EDITION</span>
      </header>
      <main>
        <section className="intro">
          <div className="intro-top">
            <span className="section-kicker">
              INDEPENDENT DATA · SHARED UNDERSTANDING
            </span>
            <span className="date">NOVEMBER 2026</span>
          </div>
          <h1>
            New York, <em>by the vote.</em>
          </h1>
          <div className="intro-bottom">
            <p>
              See where the margin came from, what changed since 2022,
              <br className="desktop-break" /> and how the map changes when
              votes determine size.
            </p>
            <span className="project-tag">
              <i /> A collaborative visualization project
            </span>
          </div>
        </section>
        <section className="explorer-toolbar" id="explore">
          <div>
            <span className="section-kicker">EXPLORE THE ATLAS</span>
            <h2>Governor & lieutenant governor</h2>
          </div>
          <span className="release-label">2026 · COUNTY EXPLORER</span>
        </section>
        <div className="data-notice">
          <span aria-hidden="true">ⓘ</span>
          <p>
            <strong>2026 results are unofficial and incomplete.</strong> Fixed
            snapshot: {statewide2026.timestamp}. This atlas does not update
            live. All 62 counties are included; district reporting is not the
            percentage of votes counted.
          </p>
        </div>
        <StatewideResults year={2026} result={statewide2026} />
        <p className="snapshot-reporting">
          {statewide2026.districtsReporting.toLocaleString("en-US")} of{" "}
          {statewide2026.districtsTotal.toLocaleString("en-US")} election
          districts reporting. The BOE warns of unscanned emergency ballots in
          Westchester.
        </p>
        <nav className="story-navigation" aria-label="Explore the story">
          <a href="#map-title">01 · Geography & votes ↓</a>
          <a href="#contributions">02 · Where the margin came from ↓</a>
          <a href="#changes">03 · What changed since 2022 ↓</a>
        </nav>
        <div className="explore-grid">
          <ElectionMap selected={selected} onSelect={setSelected} />
          <CountyDetails county={county} />
        </div>
        <div className="county-picker">
          <label htmlFor="county-select">Jump to a county</label>
          <select
            id="county-select"
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
          >
            {counties.map((item) => (
              <option key={item.fips} value={item.fips}>
                {item.name}
              </option>
            ))}
          </select>
          <span>All 62 counties · one shared selection</span>
        </div>
        <MarginContributions county={county} onSelect={setSelected} />
        <HistoricalChanges county={county} onSelect={setSelected} />
        <Comparisons county={county} onSelect={setSelected} />
        <section className="methodology" id="methodology">
          <div>
            <span className="section-kicker">THE SMALL PRINT MATTERS</span>
            <h2>
              Transparent data.
              <br />
              <em>Thoughtful interpretation.</em>
            </h2>
          </div>
          <div>
            <h3>What are we counting?</h3>
            <p>
              Candidate votes combine all ballot lines for the same candidate,
              including New York’s fusion party lines. Percentages include
              write-ins, exclude blanks and voids, and are rounded to one
              decimal. Margins are percentage-point differences between the two
              named candidates.
            </p>
            <h3>Where does the data come from?</h3>
            <p>
              2026 unofficial county and statewide results:{" "}
              <a href="https://nyenr.elections.ny.gov/HomeNoJS.aspx">
                NYS Board of Elections
              </a>
              , acquired through{" "}
              <a href="https://nysfocus.com/interactives/2026-election-results/governor/">
                New York Focus’s public results feed
              </a>
              . County totals reconcile exactly with the official statewide
              snapshot. Shares combine each candidate’s party lines once.
              Boundaries:{" "}
              <a href="https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.2023.html">
                U.S. Census Bureau, 2023, 1:5 million
              </a>
              . All runtime data is bundled locally.
            </p>
            <p>
              The historical baseline is the certified 2022 governor election
              from the{" "}
              <a href="https://results.elections.ny.gov/contest/1">
                NYS Board of Elections
              </a>
              . Historical shares include write-ins and exclude blank/void
              ballots in both years. Changes compare certified 2022 results with
              the incomplete 2026 snapshot, not individual voter behavior. No
              turnout estimate or final 2026 winner is inferred. See{" "}
              <code>data/sources.md</code> in the repository for provenance and
              limitations.
            </p>
          </div>
        </section>
      </main>
      <footer>
        <a className="brand" href="#">
          ✳ THE ELECTION ATLAS
        </a>
        <p>
          A Parsons data visualization workshop · Built for curiosity. Open to
          discussion.
        </p>
        <a href="#">Back to top ↑</a>
      </footer>
    </>
  );
}
