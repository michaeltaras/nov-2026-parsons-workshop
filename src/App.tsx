import { useState } from "react";
import { counties, statewide2026 } from "./data/elections";
import ElectionMap from "./features/ElectionMap";
import CountyDetails from "./features/CountyDetails";
import StatewideResults from "./features/StatewideResults";
import Comparisons from "./features/Comparisons";
import MarginContributions from "./features/MarginContributions";
import HistoricalChanges from "./features/HistoricalChanges";

const boroughAliases: Record<string, string> = {
  "36061": "Manhattan",
  "36047": "Brooklyn",
  "36085": "Staten Island",
  "36005": "Bronx",
  "36081": "Queens",
};

export default function App() {
  const [selected, setSelected] = useState("36061");
  const [countyQuery, setCountyQuery] = useState("");
  const county = counties.find((item) => item.fips === selected)!;
  const normalizedQuery = countyQuery.trim().toLowerCase();
  const countyResults = normalizedQuery
    ? counties.filter((item) => {
        const officialName = `${item.name} County`.toLowerCase();
        const boroughAlias = boroughAliases[item.fips]?.toLowerCase();
        return (
          officialName.includes(normalizedQuery) ||
          item.name.toLowerCase().includes(normalizedQuery) ||
          boroughAlias?.includes(normalizedQuery)
        );
      })
    : [];

  function selectCounty(fips: string) {
    setSelected(fips);
    setCountyQuery("");
  }

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
            <strong>2026 results are unofficial and incomplete.</strong> Data as
            of: {statewide2026.timestamp}. This page does not update live. All
            62 counties are included; district reporting is not the percentage
            of votes counted.
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
          <a href="#contributions">Net-vote contributions</a>
          <a href="#changes">Change since 2022</a>
        </nav>
        <div className="explore-grid">
          <ElectionMap selected={selected} onSelect={setSelected} />
          <CountyDetails county={county} />
        </div>
        <div className="county-picker">
          <div className="county-picker-row">
            <div className="county-search">
              <label htmlFor="county-search">
                Search for a county or borough
              </label>
              <input
                id="county-search"
                type="search"
                value={countyQuery}
                placeholder="Try Albany or Brooklyn"
                aria-describedby="county-search-feedback"
                onChange={(event) => setCountyQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && countyResults.length > 0) {
                    event.preventDefault();
                    selectCounty(countyResults[0].fips);
                  }
                  if (event.key === "ArrowDown" && countyResults.length > 0) {
                    event.preventDefault();
                    document
                      .querySelector<HTMLButtonElement>(
                        ".county-search-results button",
                      )
                      ?.focus();
                  }
                }}
              />
              {normalizedQuery && (
                <div id="county-search-feedback">
                  {countyResults.length === 0 ? (
                    <p className="county-search-empty">No counties found</p>
                  ) : (
                    <ul
                      className="county-search-results"
                      aria-label="County search results"
                    >
                      {countyResults.map((item) => {
                        const boroughAlias = boroughAliases[item.fips];
                        const aliasMatches =
                          boroughAlias &&
                          boroughAlias
                            .toLowerCase()
                            .includes(normalizedQuery) &&
                          boroughAlias.toLowerCase() !==
                            item.name.toLowerCase();
                        return (
                          <li key={item.fips}>
                            <button
                              type="button"
                              onClick={() => selectCounty(item.fips)}
                              onKeyDown={(event) => {
                                if (event.key === "Escape") {
                                  event.preventDefault();
                                  document
                                    .getElementById("county-search")
                                    ?.focus();
                                }
                              }}
                            >
                              {item.name} County
                              {aliasMatches ? ` (${boroughAlias})` : ""}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div className="county-select">
              <label htmlFor="county-select">Jump to a county</label>
              <select
                id="county-select"
                value={selected}
                onChange={(event) => setSelected(event.target.value)}
              >
                {counties.map((item) => (
                  <option key={item.fips} value={item.fips}>
                    {item.name} County
                  </option>
                ))}
              </select>
            </div>
          </div>
          <span>62 counties</span>
        </div>
        <MarginContributions county={county} onSelect={setSelected} />
        <HistoricalChanges county={county} onSelect={setSelected} />
        <Comparisons county={county} onSelect={setSelected} />
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
