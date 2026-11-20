import { useState } from "react";
import { counties, statewide2026 } from "./data/elections";
import ElectionMap from "./features/ElectionMap";
import CountyDetails from "./features/CountyDetails";
import StatewideResults from "./features/StatewideResults";
import Comparisons from "./features/Comparisons";
import MarginContributions from "./features/MarginContributions";
import HistoricalChanges from "./features/HistoricalChanges";
import MarginDistribution from "./features/MarginDistribution";
import { formatSourceTimestamp, snapshotAgeLabel } from "./utils/formatNumbers";
export default function App() {
  const [selected, setSelected] = useState("36061");
  const county = counties.find((item) => item.fips === selected)!;
  const sourceUpdate = formatSourceTimestamp(statewide2026.updatedISO);
  const snapshotAge = snapshotAgeLabel(statewide2026.updatedISO);
  return (
    <>
      <a className="skip-link" href="#explore">
        Skip to results
      </a>
      <header className="masthead" id="top">
        <a href="#top" className="brand">
          New York Election Results
        </a>
        <nav aria-label="Main navigation">
          <a href="#explore">Results</a>
          <a href="#methodology">Data and methodology</a>
        </nav>
      </header>
      <main>
        <section className="intro">
          <p className="section-kicker">2026 Election</p>
          <h1>New York Governor Election Results</h1>
          <p className="intro-deck">
            County results, contributions to the statewide margin and changes
            since 2022.
          </p>
          <p className="publication-meta">
            General election · November 3, 2026
          </p>
        </section>
        <section className="explorer-toolbar" id="explore">
          <h2>Statewide results</h2>
          <span className="release-label">
            Governor and lieutenant governor
          </span>
        </section>
        <div className="data-notice">
          <p>
            <strong>2026 results are unofficial and incomplete.</strong> Results
            snapshot:{" "}
            {sourceUpdate
              ? `last updated by the source on ${sourceUpdate}`
              : "source update time unavailable"}
            .
            {snapshotAge !== "snapshot update time unavailable"
              ? ` ${snapshotAge}.`
              : ""}{" "}
            This app shows a saved snapshot and does not update live.{" "}
            <a href="https://nyenr.elections.ny.gov/HomeNoJS.aspx">
              Check the source for newer results
            </a>
            . All 62 counties are included; district reporting is not the
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
        <nav className="story-navigation" aria-label="Sections">
          <a href="#map-title">County results</a>
          <a href="#margin-distribution">County margin distribution</a>
          <a href="#contributions">Net-vote contributions</a>
          <a href="#changes">Change since 2022</a>
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
          <span>62 counties</span>
        </div>
        <MarginContributions county={county} onSelect={setSelected} />
        <HistoricalChanges county={county} onSelect={setSelected} />
        <Comparisons county={county} onSelect={setSelected} />
        <MarginDistribution selected={selected} onSelect={setSelected} />
        <section className="methodology" id="methodology">
          <div>
            <h2>Data and methodology</h2>
          </div>
          <div>
            <h3>Definitions</h3>
            <p>
              Candidate votes combine all ballot lines for the same candidate,
              including New York’s fusion party lines. Percentages include
              write-ins, exclude blanks and voids, and are rounded to one
              decimal. Margins are percentage-point differences between the two
              named candidates.
            </p>
            <h3>Sources</h3>
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
              .
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
              turnout estimate or final 2026 winner is inferred.
            </p>
          </div>
        </section>
      </main>
      <footer>
        <a className="brand" href="#top">
          New York Election Results
        </a>
        <p>Parsons School of Design · Data visualization workshop</p>
        <a href="#top">Back to top</a>
      </footer>
    </>
  );
}
