import {
  counties,
  margin,
  aggregateVotes,
  candidateVoteTotal,
  statewide2026,
  share,
  type County,
} from "../data/elections";
import {
  electionColor,
  democratic,
  republican,
  writeIn,
} from "../utils/electionColors";
import { marginLabel, percent, votes } from "../utils/formatNumbers";
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
        <h2>Closest county margins</h2>
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
        <h2>County and statewide vote shares</h2>
        <p>Candidate vote shares · unofficial 2026 governor results</p>
        <div className="comparison-bars">
          {[
            { name: `${county.name} County`, result: county },
            { name: "New York State", result: statewide2026 },
          ].map(({ name, result }) => {
            const totals = aggregateVotes(result.ballotLines);
            const total = candidateVoteTotal(result);
            const hochulShare = share(totals.hochul ?? 0, total);
            const blakemanShare = share(totals.blakeman ?? 0, total);
            const writeInVotes = totals["write-in"] ?? 0;
            const writeInShare = share(writeInVotes, total);
            return (
              <div key={name}>
                <div className="result-row">
                  <strong>{name}</strong>
                  <span>{marginLabel(margin(result))}</span>
                </div>
                <div className="comparison-track">
                  <span
                    style={{
                      width: `${hochulShare ?? 0}%`,
                      background: democratic,
                    }}
                  >
                    {percent(hochulShare)}
                  </span>
                  <span
                    style={{
                      width: `${blakemanShare ?? 0}%`,
                      background: republican,
                    }}
                  >
                    {percent(blakemanShare)}
                  </span>
                  <span
                    style={{
                      width: `${writeInShare ?? 0}%`,
                      background: writeIn,
                    }}
                  />
                </div>
                <p className="fine-print">
                  Write-ins · {votes(writeInVotes)} votes
                </p>
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
            <i style={{ background: writeIn }} />
            Write-ins
          </span>
        </div>
        <div className="editorial-note">
          <p>
            Each row shows vote shares, not vote totals. Rows have equal lengths
            regardless of the number of candidate votes.
          </p>
        </div>
      </section>
    </div>
  );
}
