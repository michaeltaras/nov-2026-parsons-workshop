import {
  aggregateVotes,
  candidateVoteTotal,
  candidates,
  share,
  type Result,
} from "../data/elections";
import { votes, percent } from "../utils/formatNumbers";
import { democratic, republican } from "../utils/electionColors";
export default function StatewideResults({
  result,
  year,
}: {
  result: Result;
  year: number;
}) {
  const totals = aggregateVotes(result.ballotLines);
  const total = candidateVoteTotal(result);
  const challenger = "blakeman";
  return (
    <section className="statewide" aria-label={`${year} statewide results`}>
      <div className="section-kicker">
        STATEWIDE POPULAR VOTE <span>Unofficial snapshot</span>
      </div>
      <div className="candidate-grid">
        {(["hochul", challenger] as const).map((id, i) => (
          <div className="candidate" key={id}>
            <div className="candidate-name">
              <i style={{ background: i === 0 ? democratic : republican }} />
              {candidates[id as keyof typeof candidates].name}
              <small>{i === 0 ? "DEM" : "REP"}</small>
            </div>
            <strong style={{ color: i === 0 ? democratic : republican }}>
              {percent(share(totals[id], total))}
            </strong>
            <span>{votes(totals[id])} votes</span>
          </div>
        ))}
        <div className="total-votes">
          <small>CANDIDATE VOTES</small>
          <strong>
            {(total / 1e6).toFixed(2)}
            <em> million</em>
          </strong>
          <span>Includes {votes(totals["write-in"] ?? 0)} write-in votes</span>
        </div>
      </div>
      <div className="vote-strip" aria-label="Statewide vote shares">
        {Object.entries(totals).map(([id, n]) => (
          <span
            key={id}
            style={{
              width: `${(n / total) * 100}%`,
              background:
                id === "hochul"
                  ? democratic
                  : id === challenger
                    ? republican
                    : "#a2a397",
            }}
          />
        ))}
      </div>
      <p className="fine-print">
        Ballot lines combined by candidate. Shares exclude blank and void
        ballots. No race calls are made by this atlas.
      </p>
    </section>
  );
}
