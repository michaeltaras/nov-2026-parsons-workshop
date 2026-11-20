import historicalData from "../../data/processed/governor-2022.json";
import {
  aggregateVotes,
  candidateVoteTotal,
  combineResults,
  margin,
  type County,
  type Result,
} from "./elections";

export interface HistoricalCounty extends Result {
  fips: string;
  name: string;
  status: string;
}
export const counties2022: HistoricalCounty[] = historicalData;
export const statewide2022 = combineResults(counties2022);

// Net votes add up across counties; percentage-point margins do not.
export function netVotes(
  result: Result,
  republican = "blakeman",
): number | null {
  const totals = aggregateVotes(result.ballotLines);
  if (totals.hochul === undefined || totals[republican] === undefined) {
    return null;
  }
  return totals.hochul - totals[republican];
}

export function summarizeContributions(results: Result[]) {
  let towardHochul = 0;
  let towardBlakeman = 0;
  let missingCount = 0;
  for (const result of results) {
    const net = netVotes(result);
    if (net === null) {
      missingCount++;
    } else if (net > 0) {
      towardHochul += net;
    } else {
      towardBlakeman += Math.abs(net);
    }
  }
  return {
    towardHochul,
    towardBlakeman,
    net: towardHochul - towardBlakeman,
    missingCount,
  };
}

// Splits a change in net votes (D−R) into a vote-share effect and a
// candidate-vote volume effect. Net votes = margin × candidate votes, where the
// margin is (D−R) / all candidate votes, including write-ins and excluding
// blank/void ballots. Midpoint weights make the two parts add up to the actual
// change with no leftover interaction term, whichever year is the baseline:
//   share effect  = margin change × average candidate votes
//   volume effect = candidate-vote change × average margin
// Results are whole votes. The volume effect absorbs rounding so the two parts
// always add up exactly. This is arithmetic, not an explanation of why people
// voted differently, and a change in counted votes is not a turnout change.
export function decomposeNetChange(
  before: { net: number; votes: number },
  after: { net: number; votes: number },
) {
  if (before.votes <= 0 || after.votes <= 0) {
    return null;
  }
  const marginBefore = before.net / before.votes;
  const marginAfter = after.net / after.votes;
  const netChange = after.net - before.net;
  const shareEffect = Math.round(
    ((marginAfter - marginBefore) * (before.votes + after.votes)) / 2,
  );
  return { netChange, shareEffect, volumeEffect: netChange - shareEffect };
}

// The office and county boundaries match. The Republican ticket and completion
// status differ: this measures aggregate reported results, not voters switching.
export function compareCounty(
  current: County,
  previous = counties2022.find((county) => county.fips === current.fips),
) {
  if (!previous) {
    return null;
  }
  const margin2022 = margin(previous, "zeldin");
  const margin2026 = margin(current, "blakeman");
  const net2022 = netVotes(previous, "zeldin");
  const net2026 = netVotes(current, "blakeman");
  if (
    margin2022 === null ||
    margin2026 === null ||
    net2022 === null ||
    net2026 === null
  ) {
    return null;
  }
  const votes2022 = candidateVoteTotal(previous);
  const votes2026 = candidateVoteTotal(current);
  const breakdown = decomposeNetChange(
    { net: net2022, votes: votes2022 },
    { net: net2026, votes: votes2026 },
  );
  if (!breakdown) {
    return null;
  }
  return {
    margin2022,
    margin2026,
    marginChange: margin2026 - margin2022,
    net2022,
    net2026,
    netChange: net2026 - net2022,
    votes2022,
    votes2026,
    voteChange: votes2026 - votes2022,
    shareEffect: breakdown.shareEffect,
    volumeEffect: breakdown.volumeEffect,
  };
}

// Statewide effects are the sum of county effects, so a county that counted
// more votes adds to the volume effect at its own margin. Splitting statewide
// totals directly would instead count that geographic shift as share change.
export function summarizeNetChange(results: County[]) {
  let net2022 = 0;
  let net2026 = 0;
  let shareEffect = 0;
  let volumeEffect = 0;
  let missingCount = 0;
  for (const result of results) {
    const comparison = compareCounty(result);
    if (!comparison) {
      missingCount++;
      continue;
    }
    net2022 += comparison.net2022;
    net2026 += comparison.net2026;
    shareEffect += comparison.shareEffect;
    volumeEffect += comparison.volumeEffect;
  }
  return {
    net2022,
    net2026,
    netChange: net2026 - net2022,
    shareEffect,
    volumeEffect,
    missingCount,
  };
}
