import {
  counties,
  margin,
  aggregateVotes,
  candidateVoteTotal,
  statewide2026,
  type County,
} from "../data/elections";
import { electionColor, democratic, republican } from "../utils/electionColors";
import { marginLabel, percent } from "../utils/formatNumbers";
export default function Comparisons({
  county,
  onSelect,
}: {
  county: County;
  onSelect: (fips: string) => void;
}) {
  const closest = [...counties]
    .sort((a, b) => Math.abs(margin(a)!) - Math.abs(margin(b)!))
    .slice(0, 6);
  return (
    <div className="supporting-grid">
      <section className="chart-card">
        <span className="section-kicker">02 / THE CLOSEST COUNTIES</span>
        <h2>Every vote carries weight.</h2>
        <p>The six smallest reported candidate-share margins in 2026.</p>
        <div className="ranking">
          {closest.map((item, index) => (
            <button
              key={item.fips}
              className={
                county.fips === item.fips ? "rank-row active" : "rank-row"
              }
              onClick={() => onSelect(item.fips)}
            >
              <small>0{index + 1}</small>
              <span>{item.name}</span>
              <div className="rank-track">
                <i
                  style={{
                    width: `${(Math.abs(margin(item)!) / 10) * 100}%`,
                    background: electionColor(margin(item)),
                  }}
                />
              </div>
              <strong>{marginLabel(margin(item))}</strong>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <p className="fine-print">
          Unofficial, incomplete counts; this ordering can change. Select a
          county to explore its results.
        </p>
      </section>
      <section className="chart-card">
        <span className="section-kicker">
          03 / PUTTING THE VOTE IN PERSPECTIVE
        </span>
        <h2>A county isn’t the whole story.</h2>
        <p>Candidate vote shares · unofficial 2026 governor results</p>
        <div className="comparison-bars">
          {[
            { name: `${county.name} County`, result: county },
            { name: "New York State", result: statewide2026 },
          ].map(({ name, result }) => {
            const totals = aggregateVotes(result.ballotLines);
            const total = candidateVoteTotal(result);
            return (
              <div key={name}>
                <div className="result-row">
                  <strong>{name}</strong>
                  <span>{marginLabel(margin(result))}</span>
                </div>
                <div className="comparison-track">
                  <span
                    style={{
                      width: `${(totals.hochul / total) * 100}%`,
                      background: democratic,
                    }}
                  >
                    {percent((totals.hochul / total) * 100)}
                  </span>
                  <span
                    style={{
                      width: `${(totals.blakeman / total) * 100}%`,
                      background: republican,
                    }}
                  >
                    {percent((totals.blakeman / total) * 100)}
                  </span>
                  <span style={{ flex: 1, background: "#999c90" }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="chart-key">
          <span>
            <i style={{ background: democratic }} />
            Hochul
          </span>
          <span>
            <i style={{ background: republican }} />
            Blakeman
          </span>
          <span>
            <i style={{ background: "#999c90" }} />
            Write-ins
          </span>
        </div>
        <div className="editorial-note">
          <strong>Read beyond the map.</strong>
          <p>
            A large county can have relatively few voters. Statewide results
            count votes equally, regardless of the land area where they were
            cast.
          </p>
        </div>
      </section>
    </div>
  );
}
