import { useState } from "react";
import { counties, statewide2026, type County } from "../data/elections";
import { netVotes, summarizeContributions } from "../data/analysis";
import { democratic, republican } from "../utils/electionColors";
import { signedVotes, votes } from "../utils/formatNumbers";

export default function MarginContributions({
  county,
  onSelect,
}: {
  county: County;
  onSelect: (fips: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const ranked = [...counties]
    .filter((item) => netVotes(item) !== null)
    .sort((a, b) => Math.abs(netVotes(b)!) - Math.abs(netVotes(a)!));
  // Show both directions on the same scale, even when the eight largest absolute
  // contributions all favor one candidate. Expanding reveals the complete list.
  const largestEachWay = [
    ...ranked.filter((item) => netVotes(item)! > 0).slice(0, 4),
    ...ranked.filter((item) => netVotes(item)! < 0).slice(0, 4),
  ];
  const visible = showAll ? ranked : largestEachWay;
  const largest = Math.max(...ranked.map((item) => Math.abs(netVotes(item)!)));
  const summary = summarizeContributions(counties);
  const selectedNet = netVotes(county);
  return (
    <section
      className="analysis-section"
      id="contributions"
      aria-labelledby="contributions-title"
    >
      <div className="analysis-heading">
        <div>
          <span className="section-kicker">
            02 / HOW THE STATEWIDE MARGIN ADDS UP
          </span>
          <h2 id="contributions-title">
            Big leads and big places aren’t the same.
          </h2>
        </div>
        <span className="provisional-tag">2026 · UNOFFICIAL / INCOMPLETE</span>
      </div>
      <p className="analysis-deck">
        A county’s net contribution is Hochul votes minus Blakeman votes. These
        vote differences add up to the statewide margin; county percentage-point
        margins don’t.
      </p>
      <div
        className="contribution-equation"
        aria-label="Statewide net-vote arithmetic"
      >
        <div>
          <small>NET VOTES IN COUNTIES FAVORING HOCHUL</small>
          <strong style={{ color: democratic }}>
            {votes(summary.towardHochul)}
          </strong>
        </div>
        <span aria-hidden="true">−</span>
        <div>
          <small>NET VOTES IN COUNTIES FAVORING BLAKEMAN</small>
          <strong style={{ color: republican }}>
            {votes(summary.towardBlakeman)}
          </strong>
        </div>
        <span aria-hidden="true">=</span>
        <div>
          <small>STATEWIDE REPORTED DIFFERENCE</small>
          <strong>{signedVotes(netVotes(statewide2026)!)}</strong>
        </div>
      </div>
      <div className="analysis-content">
        <div>
          <div className="diverging-key">
            <span>← Net votes toward Blakeman</span>
            <span>Net votes toward Hochul →</span>
          </div>
          <p className="fine-print">
            Symmetric scale · full bar on either side = {votes(largest)} net
            votes
          </p>
          <div
            className="contribution-list"
            aria-label="County net-vote contributions"
          >
            {visible.map((item) => {
              const net = netVotes(item)!;
              const width = (Math.abs(net) / largest) * 50;
              return (
                <button
                  key={item.fips}
                  className={
                    item.fips === county.fips
                      ? "analysis-row active"
                      : "analysis-row"
                  }
                  aria-pressed={item.fips === county.fips}
                  aria-label={`${item.name} County contribution: ${votes(Math.abs(net))} net votes toward ${net >= 0 ? "Hochul" : "Blakeman"}`}
                  onClick={() => onSelect(item.fips)}
                >
                  <span className="analysis-county-name">{item.name}</span>
                  <span className="diverging-track" aria-hidden="true">
                    <i
                      style={{
                        left: `${net >= 0 ? 50 : 50 - width}%`,
                        width: `${width}%`,
                        background: net >= 0 ? democratic : republican,
                      }}
                    />
                  </span>
                  <strong>{signedVotes(net)}</strong>
                </button>
              );
            })}
          </div>
          <button
            className="toggle analysis-expand"
            aria-expanded={showAll}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll
              ? "Show four largest per candidate"
              : "Show all 62 county contributions"}
          </button>
          <p className="fine-print">
            {showAll
              ? "All counties"
              : "Four largest contributions toward each candidate"}{" "}
            ·{" "}
            {showAll
              ? "ordered by absolute magnitude"
              : "ordered by magnitude within each direction"}
            . Positive values favor Hochul, negative values favor Blakeman.
            Ordering may change as counting continues.
          </p>
        </div>
        <aside
          className="analysis-spotlight"
          aria-label="Selected county contribution"
        >
          <span className="section-kicker">FOLLOWING YOUR COUNTY</span>
          <h3>{county.name} County</h3>
          <strong
            className="analysis-number"
            style={{ color: (selectedNet ?? 0) >= 0 ? democratic : republican }}
          >
            {selectedNet === null ? "Not available" : signedVotes(selectedNet)}
          </strong>
          <p>
            net reported votes toward{" "}
            {selectedNet === 0
              ? "neither candidate (a tie)"
              : (selectedNet ?? 0) > 0
                ? "Hochul"
                : "Blakeman"}
            .
          </p>
          <p>
            A large share margin can contribute fewer net votes than a small
            share margin in a county with many voters.
          </p>
          <p className="fine-print">
            The sum includes all 62 counties, including those with incomplete
            district reporting. Write-ins are included in candidate-share
            denominators but do not enter the difference between these two
            candidates.
          </p>
        </aside>
      </div>
    </section>
  );
}
