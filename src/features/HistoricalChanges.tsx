import { useState } from "react";
import { scaleLinear } from "d3";
import {
  counties,
  statewide2026,
  margin,
  type County,
} from "../data/elections";
import {
  compareCounty,
  netVotes,
  statewide2022,
  summarizeNetChange,
} from "../data/analysis";
import NetChangeBreakdown from "./NetChangeBreakdown";
import { democratic, republican } from "../utils/electionColors";
import {
  changeLabel,
  marginLabel,
  signedVotes,
  votes,
} from "../utils/formatNumbers";

const marginPosition = scaleLinear().domain([-100, 100]).range([6, 94]);

export default function HistoricalChanges({
  county,
  onSelect,
}: {
  county: County;
  onSelect: (fips: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const comparisons = counties
    .map((item) => ({ county: item, comparison: compareCounty(item) }))
    .filter((item) => item.comparison !== null)
    .sort(
      (a, b) =>
        Math.abs(b.comparison!.marginChange) -
        Math.abs(a.comparison!.marginChange),
    );
  const visible = showAll ? comparisons : comparisons.slice(0, 8);
  // Keep a selected county visible even when it is outside the largest changes.
  if (!showAll && !visible.some((item) => item.county.fips === county.fips)) {
    const selected = comparisons.find(
      (item) => item.county.fips === county.fips,
    );
    if (selected) {
      visible.push(selected);
    }
  }
  const selected = compareCounty(county);
  const statewideChange =
    margin(statewide2026)! - margin(statewide2022, "zeldin")!;
  const statewideNetChange =
    netVotes(statewide2026)! - netVotes(statewide2022, "zeldin")!;
  const breakdown = summarizeNetChange(counties);
  return (
    <section
      className="analysis-section"
      id="changes"
      aria-labelledby="changes-title"
    >
      <div className="analysis-heading">
        <div>
          <span className="section-kicker">Governor · 2022–2026</span>
          <h2 id="changes-title">Change since the 2022 governor election</h2>
        </div>
        <span className="provisional-tag">Provisional comparison</span>
      </div>
      <p className="comparison-caution">
        <strong>Certified 2022 vs. incomplete 2026.</strong> The 2026 snapshot
        can change as ballots are counted. Hochul/Delgado faced Zeldin/Esposito
        in 2022; Hochul/Adams faced Blakeman/Hood in 2026. These are
        county-level differences, not evidence of individual voters switching
        parties.
      </p>
      <div className="history-state-summary">
        <p>
          <small>Statewide D−R share margin</small>
          <strong>
            {marginLabel(margin(statewide2022, "zeldin"))} →{" "}
            {marginLabel(margin(statewide2026))}
          </strong>
          <span>{changeLabel(statewideChange)} in the current count</span>
        </p>
        <p>
          <small>Change in statewide net votes (D−R)</small>
          <strong>{signedVotes(statewideNetChange)}</strong>
          <span>change in Hochul votes minus Republican-ticket votes</span>
        </p>
      </div>
      <div className="net-change-breakdown">
        <h3>Vote shares and vote counts in the net-vote change</h3>
        <p>
          Net votes are the D−R share margin multiplied by candidate votes, so
          they can change because the split changed, because more or fewer
          candidate votes were counted, or both.
        </p>
        <NetChangeBreakdown
          net2022={breakdown.net2022}
          net2026={breakdown.net2026}
          shareEffect={breakdown.shareEffect}
          volumeEffect={breakdown.volumeEffect}
        />
        <p className="fine-print">
          Positive values add to Hochul’s net-vote advantage. Each county’s
          change is split using the average of its 2022 and 2026 vote counts and
          margins, so the two parts add up exactly with no leftover term; the
          statewide parts are the sum of the{" "}
          {counties.length - breakdown.missingCount} counties’ parts. Shares
          include write-ins and exclude blank and void ballots. A change in
          counted candidate votes is not a turnout or final participation
          change: the 2026 count is incomplete. This is an arithmetic breakdown,
          not evidence of why people voted differently or which voters switched
          parties.
        </p>
      </div>
      <div className="analysis-content">
        <div>
          <div className="history-key">
            <span>
              <i className="history-dot previous" />
              2022 · certified
            </span>
            <span>
              <i className="history-dot current" />
              2026 · unofficial
            </span>
          </div>
          <div className="history-axis-row" aria-hidden="true">
            <span />
            <div className="history-axis">
              {[-100, -50, 0, 50, 100].map((value) => (
                <span key={value} style={{ left: `${marginPosition(value)}%` }}>
                  {value === 0
                    ? "Even"
                    : `${value > 0 ? "D" : "R"} +${Math.abs(value)}`}
                </span>
              ))}
            </div>
            <span />
          </div>
          <div
            className="history-list"
            aria-label="County margin changes since 2022"
          >
            {visible.map(({ county: item, comparison }) => {
              const result = comparison!;
              const before = marginPosition(result.margin2022);
              const after = marginPosition(result.margin2026);
              return (
                <button
                  key={item.fips}
                  className={
                    item.fips === county.fips
                      ? "history-row active"
                      : "history-row"
                  }
                  aria-pressed={item.fips === county.fips}
                  aria-label={`${item.name} County comparison: 2022 ${marginLabel(result.margin2022)}; 2026 ${marginLabel(result.margin2026)}; ${changeLabel(result.marginChange)}`}
                  onClick={() => onSelect(item.fips)}
                >
                  <span className="analysis-county-name">{item.name}</span>
                  <span className="history-track" aria-hidden="true">
                    <i
                      className="history-connector"
                      style={{
                        left: `${Math.min(before, after)}%`,
                        width: `${Math.abs(after - before)}%`,
                      }}
                    />
                    <i
                      className="history-dot previous"
                      style={{ left: `${before}%` }}
                    />
                    <i
                      className="history-dot current"
                      style={{
                        left: `${after}%`,
                        background:
                          result.margin2026 >= 0 ? democratic : republican,
                      }}
                    />
                  </span>
                  <strong>{changeLabel(result.marginChange)}</strong>
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
              ? "Show largest margin changes"
              : "Show all 62 county comparisons"}
          </button>
          <p className="fine-print">
            {showAll
              ? "All counties"
              : "Eight largest absolute margin changes, plus your selected county if needed"}
            . Positions use D−R share margin, in percentage points of all
            candidate votes including write-ins. A county’s dot can move without
            its reported leading party changing.
          </p>
        </div>
        <aside
          className="analysis-spotlight"
          aria-label="Selected county historical comparison"
        >
          <span className="section-kicker">Selected county</span>
          <h3>{county.name} County</h3>
          {selected ? (
            <>
              <strong className="history-change">
                {changeLabel(selected.marginChange)}
              </strong>
              <dl className="history-metrics">
                <div>
                  <dt>2022 D−R margin</dt>
                  <dd>{marginLabel(selected.margin2022)}</dd>
                </div>
                <div>
                  <dt>2026 D−R margin</dt>
                  <dd>{marginLabel(selected.margin2026)}</dd>
                </div>
                <div>
                  <dt>2022 net votes (D−R)</dt>
                  <dd>{signedVotes(selected.net2022)}</dd>
                </div>
                <div>
                  <dt>2026 net votes (D−R)</dt>
                  <dd>{signedVotes(selected.net2026)}</dd>
                </div>
                <div>
                  <dt>Change in net votes</dt>
                  <dd>{signedVotes(selected.netChange)}</dd>
                </div>
                <div>
                  <dt>From changing vote shares</dt>
                  <dd>{signedVotes(selected.shareEffect)}</dd>
                </div>
                <div>
                  <dt>From changing vote counts</dt>
                  <dd>{signedVotes(selected.volumeEffect)}</dd>
                </div>
              </dl>
              <h4>Candidate votes counted</h4>
              <p>
                {votes(selected.votes2022)} candidate votes in certified 2022
                results; {votes(selected.votes2026)} reported so far in 2026 (
                {signedVotes(selected.voteChange)}).
              </p>
              <p className="fine-print">
                This is a difference in counted candidate votes, not a turnout
                rate or a final participation change. Registered voters are not
                the denominator. The comparison does not explain why results
                changed.
              </p>
            </>
          ) : (
            <p>No comparable historical result is available.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
