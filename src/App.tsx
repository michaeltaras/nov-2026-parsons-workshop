import { useState } from "react";
import { counties, statewide2022, statewide2026 } from "./data/elections";
import ElectionMap from "./features/ElectionMap";
import CountyDetails from "./features/CountyDetails";
import StatewideResults from "./features/StatewideResults";
import Comparisons from "./features/Comparisons";
export default function App() {
  const [selected, setSelected] = useState("36061");
  const [year, setYear] = useState(2022);
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
              Look closer at the places, people, and patterns
              <br className="desktop-break" /> behind New York’s election
              results.
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
          <div className="year-control" aria-label="Election year">
            {[2022, 2026].map((value) => (
              <button
                key={value}
                onClick={() => setYear(value)}
                aria-pressed={year === value}
                className={year === value ? "active" : ""}
              >
                {value}
                <small>
                  {value === 2022 ? "County explorer" : "Statewide snapshot"}
                </small>
              </button>
            ))}
          </div>
        </section>
        <div className="data-notice">
          <span aria-hidden="true">ⓘ</span>
          <p>
            {year === 2022 ? (
              <>
                <strong>You’re exploring certified 2022 results.</strong>{" "}
                Verified 2026 county data wasn’t acquired for this release.
                Switch to the 2026 snapshot for the available unofficial
                statewide totals.
              </>
            ) : (
              <>
                <strong>2026 results are unofficial and incomplete.</strong> A
                fixed snapshot from November 9, 2026, 9:10 p.m. ET. This atlas
                does not update live. County-level results are unavailable.
              </>
            )}
          </p>
        </div>
        <StatewideResults
          year={year}
          result={year === 2022 ? statewide2022 : statewide2026}
        />
        {year === 2022 ? (
          <>
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
            <Comparisons county={county} onSelect={setSelected} />
          </>
        ) : (
          <section className="snapshot-note">
            <span className="section-kicker">
              A SNAPSHOT, NOT A FINAL RESULT
            </span>
            <h2>The count continues.</h2>
            <p>
              {statewide2026.districtsReporting.toLocaleString("en-US")} of{" "}
              {statewide2026.districtsTotal.toLocaleString("en-US")} election
              districts reported in this source snapshot. District reporting is
              not the percentage of votes counted.
            </p>
            <p>
              The state’s source warns of unscanned emergency ballots in
              Westchester. County results are omitted until a verifiable dataset
              is acquired; statewide votes have not been distributed or
              estimated across counties.
            </p>
            <button className="text-button" onClick={() => setYear(2022)}>
              Explore the certified 2022 county map →
            </button>
          </section>
        )}
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
              2022 certified county results:{" "}
              <a href="https://results.elections.ny.gov/contest/1">
                NYS Board of Elections
              </a>
              . 2026 unofficial statewide snapshot:{" "}
              <a href="https://nyenr.elections.ny.gov/HomeNoJS.aspx">
                NYS election night reporting
              </a>
              . Boundaries:{" "}
              <a href="https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.2023.html">
                U.S. Census Bureau, 2023, 1:5 million
              </a>
              . All runtime data is bundled locally.
            </p>
            <p>
              No turnout estimate, historical swing, or final 2026 winner is
              inferred. See <code>data/sources.md</code> in the repository for
              provenance and limitations.
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
